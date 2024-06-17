import { useState, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { IoArrowUndo, IoArrowRedo } from "react-icons/io5";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { RxRotateCounterClockwise } from "react-icons/rx";
import { BsPencilFill } from "react-icons/bs";
import { LiaMarkerSolid } from "react-icons/lia";
import { BsEraserFill } from "react-icons/bs";
import { GiSaveArrow } from "react-icons/gi"; 
import { TiTick } from "react-icons/ti";
import CanvaSheet from "./CanvaSheet";

function CanvaUI() { 
  // Child reference 
  const childRef = useRef();

  // States   
  const [modified,setModified] = useState(false);
  const [title,setTitle] = useState('');
  const [zoomIn, setZoomIn] = useState(true);
  const [bWidth, setbWidth] = useState("w-full");
  const [style, setStyle] = useState({
    pen: {
      pallateVisible: false,
      color: "#FF0000",
      width: 2,
    },
    text: {
      pallateVisible: false,
      color: "#000000",
      width: 2,
    },
    eraser: {
      pallateVisible: false,
      width: 2
    }
  });
  const [current, setCurrent] = useState();

  useEffect(()=>{
    if(title) setModified(true);
    else setModified(false);
  },[title])

  // Functions 
  const onZoomClick = () => {
    if (zoomIn) {
      setZoomIn(false);
      setbWidth("w-1/2");
    } else {
      setZoomIn(true);
      setbWidth("w-full");
    }
  };


  const selectCurrentStyle = () => {
    if (current) {
      setStyle({
        ...style,
        [current]: { pallateVisible: false, ...style[current] },
      });
    }
  };

  const undoDraw = () => {
    setCurrent('');
    if(childRef.current){
      childRef.current.undo();
    }
  }

  const redoDraw = () => {
    setCurrent('');
    if(childRef.current){
      childRef.current.redo();
    }
  }

  const download = () => {
    setCurrent('');
    if(childRef.current){
      childRef.current.downloads();
    }
  }

  const handleSave = ( ) => {

  }

  return (
    <div
      className={` bg-slate-100 h-screen ${bWidth} shadow-lg shadow-black overflow-hidden`}
    >
      <div className="text-2xl border border-slate-200 shadow-md flex items-center justify-between px-5">
        <div onClick={onZoomClick} className="text-4xl m-3">
          {!zoomIn ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />}
        </div>
        <div className="text-3xl">
          <input
            type="text"
            placeholder="Title"
            className=" p-2   text-center bg-slate-100 font-serif font-bold "
            id=""
            onChange={(e)=>{setTitle(e.target.value)}}
            value={title.trim()==''?'':title}
          />
        </div>
        <div className="text-4xl">
          {!modified ?  <IoMdClose /> : <TiTick onClick={handleSave} />}
        </div>
      </div>
      <div className=" bg-white h-1/2 fixed"></div>

      <CanvaSheet ref={childRef} style={style} setStyle={setStyle} current={current} zoomIn={zoomIn} modified={modified} setModified={setModified} />

      <div className={`fixed bottom-6 ${bWidth} px-6 `}>
        <div className=" flex justify-center w-full mb-5">
          {current === "pen" && style[current].pallateVisible && (
            <div className="text-xl border-2 bg-white p-3 rounded-md shadow-md">
              <div
                className="flex justify-end"
                onClick={() => {
                  setStyle({
                    ...style,
                    [current]: { ...style[current], pallateVisible: false },
                  });
                }}
              >
                <IoMdClose />
              </div>
              Set Colour :{" "}
              <input
                onChange={(e) => {
                  setStyle({
                    ...style,
                    pen: { ...style["pen"], color: e.target.value },
                  });
                }}
                value={style['pen'].color}
                type="color"
              />
              <br />
              Set Width :{" "}
              <input
                onChange={(e) => {
                  setStyle({
                    ...style,
                    pen: { ...style["pen"], width: e.target.value },
                  });
                }}
                type="range"
                value={style["pen"].width}
                defaultValue={5}
                min={2}
                max={100}
              />
            </div>
          )}

          {current === "text" && style[current].pallateVisible && (
            <div className="text-xl border-2 bg-white p-3 rounded-md shadow-md">
              <div
                className="flex justify-end"
                onClick={() => {
                  setStyle({
                    ...style,
                    [current]: { ...style[current], pallateVisible: false },
                  });
                }}
              >
                <IoMdClose />
              </div>
              Set Colour :{" "}
              <input
                value={style["text"].color}
                onChange={(e) => {
                  setStyle({
                    ...style,
                    text: { ...style["text"], color: e.target.value },
                  });
                }}
                type="color"
              />
              <br />
              Set Width :{" "}
              <input
                value={style["text"].width}
                onChange={(e) => {
                  setStyle({
                    ...style,
                    text: { ...style["text"], width: e.target.value },
                  });
                }}
                type="range"
                defaultValue={5}
                min={2}
                max={10}
              />
            </div>
          )}

          {current === "eraser" && style[current].pallateVisible && (
            <div className="text-xl border-2 bg-white p-3 rounded-md shadow-md">
              <div
                className="flex justify-end"
                onClick={() => {
                  setStyle({
                    ...style,
                    [current]: { ...style[current], pallateVisible: false },
                  });
                }}
              >
                <IoMdClose />
              </div>
              Set Width :{" "}
              <input
                onChange={(e) => {
                  setStyle({
                    ...style,
                    eraser: { ...style["eraser"], width: e.target.value },
                  });
                }}
                defaultValue={5}
                type="range"
                min={2}
                max={100}
              />
            </div>
          )}
        </div>

        <div className={`flex justify-between items-center `}>
          <div className="text-3xl flex gap-5 ">
            <IoArrowUndo onClick={undoDraw} className=" cursor-pointer" />
            <IoArrowRedo onClick={redoDraw} className=" cursor-pointer" />
          </div>

          <div className="flex justify-center text-6xl gap-7">
            <BsPencilFill
              name="pen"
              onClick={() => {
                selectCurrentStyle();
                setCurrent("pen");
                setStyle({
                  ...style,
                  pen: { ...style[style.pen], pallateVisible: true },
                });
              }}
              className={` cursor-pointer  ${
                current == "pen" ? "text-7xl text-pink-800" : ""
              } toolbar`}
            />

            <LiaMarkerSolid
              onClick={() => {
                selectCurrentStyle();
                setCurrent("text");
                setStyle({
                  ...style,
                  text: { ...style[style.text], pallateVisible: true },
                });
              }}
              name="text"
              className={` cursor-pointer  ${
                current === "text" ? "text-7xl text-pink-800" : ""
              } toolbar `}
            />

            <BsEraserFill
              onClick={() => {
                selectCurrentStyle();
                setCurrent("eraser");
                setStyle({
                  ...style,
                  eraser: { ...style[style.eraser], pallateVisible: true },
                });
              }}
              name="eraser"
              className={` cursor-pointer  ${
                current == "eraser" ? "text-7xl text-pink-800" : ""
              } toolbar `}
            />
            <div className=" cursor-pointer" onClick={download}><GiSaveArrow  /></div>
          </div>
          <div className="text-4xl">
            <RxRotateCounterClockwise />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanvaUI;
