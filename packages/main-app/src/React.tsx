import { mount, unmount } from "react-micro-app"
import React, { useEffect } from "react";
// import React from "react";
import "react-micro-app/dist/style.css"

const containerId = 'react-app';

function ReactApp() {
  useEffect(() => {
    mount(containerId);
    return () => {
      unmount();
    };
  }, []);
  return <div id={containerId}>ReactApp</div>;
}

export default React.memo(ReactApp);
