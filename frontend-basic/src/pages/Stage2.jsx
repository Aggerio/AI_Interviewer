import {
  ResizeContent,
  ResizeHandleLeft,
  ResizeHandleRight,
  ResizePanel,
} from "react-hook-resize-panel";
import CodeEditor from "../components/Editor";

function Stage2() {
  return (
    <div style={{ flexFlow: "row nowrap", flexGrow: 1, display: "flex" }}>
      <ResizePanel initialWidth={600}>
        <ResizeContent style={{ backgroundColor: "#283430" }}>
          <p>{"hello"}</p>
        </ResizeContent >
        <ResizeHandleRight>
          <div
            style={{
              cursor: "col-resize",
              width: 5,
              height: 1000,
              backgroundColor: "black",
            }}>
          </div>

        </ResizeHandleRight>

        <div style={{ flexGrow: 1, backgroundColor: "#34282c" }}>

          <ResizePanel initialWidth={600}>
            <ResizeContent style={{ backgroundColor: "#283430" }}>
              <CodeEditor />
            </ResizeContent >
          </ResizePanel>
        </div>

      </ResizePanel>
      {/* <ResizePanel initialWidth={300}> */}
      {/*   <ResizeHandleLeft> */}
      {/*     <div */}
      {/*       style={{ */}
      {/*         cursor: "col-resize", */}
      {/*         width: 5, */}
      {/*         backgroundColor: "black", */}
      {/*       }} */}
      {/*     /> */}
      {/*   </ResizeHandleLeft> */}
      {/*   <ResizeContent style={{ backgroundColor: "#283430" }} /> */}
      {/* </ResizePanel> */}
      <div />
    </div>
  );
}

export default Stage2;
