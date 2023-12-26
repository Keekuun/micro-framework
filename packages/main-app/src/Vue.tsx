import { mount, unmount } from "vue-micro-app"
import React, { useEffect } from "react";
// import React from "react";

const containerId = 'vue-app';

function VueApp() {
  useEffect(() => {
    mount(containerId);
    return () => {
      unmount();
    };
  }, []);
  return <div id={containerId} style={{ textAlign: "center" }}>VueApp</div>;
}

export default React.memo(VueApp);
