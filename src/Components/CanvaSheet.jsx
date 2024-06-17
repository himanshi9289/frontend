import { Layer, Line,  Stage,  Arrow, Rect  } from "react-konva";
import { useRef, useState,forwardRef, useImperativeHandle } from "react";

const CanvaSheet = forwardRef((props,ref) => {
    const stageRef = useRef(true);
    const [pointer,setPointer] = useState(0);
    const [allState, setAllState] = useState([]);
    const [trash,setTrash] = useState([]);
    let {style, setStyle , current, zoomIn,modified, setModified } = props;


    useImperativeHandle(ref, ()=>({
        undo:undoOperations,
        redo:redoOperation,
        downloads: handleDownload
    }))

    if(!modified && allState.length){
        setModified(true);
    }

    const pointerDown = (e) => {
        if(!current) return;
        if(current==="eraser" && !allState.length) return;
        stageRef.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setStyle({...style,[current]:{...style[current],pallateVisible:false}})
        setTrash([]);
        if(!style[current].color) style[current].color="#000000";
        switch(current){
            case "pen" : setAllState([...allState, { id: 1 , points: [pos.x, pos.y], color: style[current].color, width: style[current].width }]);
                            break;
            case "text" : setAllState([...allState, { id: 2 , points: [pos.x, pos.y], color: style[current].color, width: style[current].width }]);
                            break;
            default : setAllState([...allState, { id: 3 , points: [pos.x, pos.y], width: style[current].width }]);
        }
        setPointer(pointer+1);
    }
    
    const pointerMove = (e) => {
        if (!stageRef.current || !current) {
            return;
          }
          const stage = e.target.getStage();
          const point = stage.getPointerPosition();
          let lastLine = allState[allState.length - 1];
          lastLine.points = lastLine.points.concat([point.x, point.y]);
          allState.splice(allState.length - 1, 1, lastLine);
          setAllState(allState.concat());
    }
    
    const pointerUp = (e) => {
        stageRef.current = false;
    }

    const undoOperations = () => {
        if(!allState.length || pointer<1){
            alert("Nothing to undo");
            return;
        } 
        console.log('Undo')
        setTrash([...trash,allState[pointer-1]]);
        setAllState([...allState.slice(0,-1)]);
        setPointer(pointer-1);
    }

    const redoOperation = () => {
        console.log(pointer)
        if(!trash.length){
            alert("Nothing to redo");
            return;
        } 
        setAllState([...allState,trash[trash.length-1]]);
        setTrash([...trash.slice(0,-1)]);
        setPointer(pointer+1);
    }

    const handleDownload = async() => {
        const uri = await stageRef.current.toDataURL();
        var link = document.createElement("a");
        link.download="image.png";
        link.href=uri;
        document.body.appendChild(link);
        link.click();
        document.removeChild(link);
    }

    return(
        <div className="">
            <Stage
                ref={stageRef}
                width={zoomIn?window.innerWidth:window.innerWidth/2}
                height={500}
                onPointerDown={pointerDown}
                onPointerMove={pointerMove}
                onPointerUp={pointerUp} className=" bg-white" >
                <Layer>
                    <Rect x={0} y={0} width={zoomIn?window.innerWidth:window.innerWidth/2} height={500} fill="white"/>
                    {allState.map((line, i) => (
                        <Line
                        key={i}
                        points={line.points}
                        stroke={line.color??'#FFFFFF'}
                        strokeWidth={line.width}
                        tension={0.5}
                        lineCap="round"
                        dash={[10,line.id==2?13:1]}
                        lineJoin="round"
                        globalCompositeOperation={ 'source-over' } />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
}
)
export default CanvaSheet;