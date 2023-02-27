import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);

  const [dragTarget, setDragTarget] = useState();

  useEffect(() => {
    let container = document.querySelector("#parent");
    setDragTarget(container);
  }, [])


  const addMoveable = async () => {
    // Create a new moveable component and add it to the array
    // const COLORS = ["red", "blue", "yellow", "green", "purple"];
    // console.log(await getImage());
    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        //color: COLORS[Math.floor(Math.random() * COLORS.length)],
        updateEnd: true,
        backgroundImage: await getImage()
      },
    ]);
  };

  const getImage = async () => {
    const RANDOM_ID = Math.floor(Math.random() * 100);
    return await fetch(`https://jsonplaceholder.typicode.com/photos/${RANDOM_ID}`)
      .then(response => response.json())
      .then(json => json.url)
  }

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {

      if ((newComponent.left + newComponent.width) <= dragTarget.clientWidth)
        if ((newComponent.top + newComponent.height) <= dragTarget.clientHeight)
          if (newComponent.left >= 1)
            if (newComponent.top >= 1)
              if (moveable.id === id) {
                return { id, ...newComponent, updateEnd };
              }

      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  const eliminarComponente = (e, item) => {
    e.preventDefault();
    const newList = moveableComponents.filter(component => component.id !== item.id)
    console.log(newList);
    setMoveableComponents(newList)

  }

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>

      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
      <div className="lista-container">
        <h1>Lista de componentes</h1>
        <ul>
          {moveableComponents.map((item, index) => (
            <li key={index}>
              <div>
                Id: {item.id}
                <img src={`${item.backgroundImage}`}
                  style={{ width: "30px", height: "30px" }}
                />
                <button onClick={e => eliminarComponente(e, item)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </main>
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  color,
  id,
  setSelected,
  isSelected = false,
  updateEnd,
  backgroundImage,
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
    backgroundImage,
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();

  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    // updateMoveable(id, {
    //   top,
    //   left,
    //   width: newWidth,
    //   height: newHeight,
    //   color,
    //   backgroundImage
    // });

    // console.log({
    //   id, ...{
    //     top,
    //     left,
    //     width: newWidth,
    //     height: newHeight,
    //     color,
    //     backgroundImage
    //   }
    // });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;


    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });


    updateMoveable(id, {
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
      width: newWidth,
      height: newHeight,
      color,
      backgroundImage
    });
    // console.log({
    //   ...{
    //     ...nodoReferencia,
    //     translateX,
    //     translateY,
    //     top: top + translateY < 0 ? 0 : top + translateY,
    //     left: left + translateX < 0 ? 0 : left + translateX,
    //   }
    // });
  };

  const onResizeEnd = async (e) => {
    let newWidth = e.lastEvent?.width;
    let newHeight = e.lastEvent?.height;
    // console.log("new Width " + newWidth);
    // console.log("new Height " + newHeight);
    // console.log("---------------------------");

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    const { lastEvent } = e;
    const { drag } = lastEvent;
    const { beforeTranslate } = drag;

    const absoluteTop = top + beforeTranslate[1];
    const absoluteLeft = left + beforeTranslate[0];

    // console.log("absoluteTop " + absoluteTop);
    // console.log("absoluteTop " + absoluteTop);
    // console.log("---------------------------");
    updateMoveable(
      id,
      {
        top: absoluteTop,
        left: absoluteLeft,
        width: newWidth,
        height: newHeight,
        color,
        backgroundImage
      },
      true
    );

  };

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          background: color,
        }}
        onClick={() => setSelected(id)}
      >
        <img src={backgroundImage}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%"
          }} />
      </div>

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        onDrag={(e) => {
          updateMoveable(id, {
            top: e.top,
            left: e.left,
            width,
            height,
            color,
            backgroundImage
          });
        }}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};
