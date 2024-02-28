import React from "react";
import useCanvas from "./useCanvas";

const Canvas = (props) => {

  const { init, ...rest } = props;
  const ref = useCanvas(init);

  return <canvas ref={ref} {...rest} />;
};

export default Canvas;
