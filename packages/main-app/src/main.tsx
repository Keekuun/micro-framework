import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ReactApp from "./React.tsx";
import VueApp from "./Vue.tsx";

window.__POWERED_BY_MICRO__ = true

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "react",
        element: <ReactApp/>,
      },
      {
        path: "vue",
        element: <VueApp/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
