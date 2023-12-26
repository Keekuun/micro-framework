import React from 'react'
import ReactDOM, {Root} from 'react-dom/client'
import App from './App.tsx'
import './index.css'

let root: Root;
let containerId = 'root';
export function mount(id: string = 'root') {
  console.log("react app mount");
  containerId = id
  root = ReactDOM.createRoot(document.getElementById(containerId)!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export function unmount() {
  console.log("react app unmount: ", containerId);
  root && root.unmount();
}

if(!window.__POWERED_BY_MICRO__) {
  mount()
}
