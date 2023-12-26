import { createApp } from 'vue'
import type { App as AppType } from 'vue'
import './style.css'
import App from './App.vue'

let app: AppType;
let containerId = 'app';

export function mount(id = "app") {
  console.log("vue app mount");
  containerId = id;
  app = createApp(App);
  app.mount(`#${id}`);
}

export function unmount() {
  console.log("vue app unmount id: ", containerId);
  app && app.unmount();
}
