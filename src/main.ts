/**
 * Application entry point.
 *
 * Registers global plugins in order:
 *   1. SaxVue  — UI component library (registers all sv-* components globally)
 *   2. Router  — Vue Router with the app's route definitions
 *
 * Theme colours are set here so they propagate to every SaxVue component
 * via CSS custom properties.
 */
import { createApp } from "vue";
import SaxVue from "@mrxploder/saxvue";
import "@mrxploder/saxvue/dist/saxvue.css";
import "boxicons/css/boxicons.min.css";
import App from "./App.vue";
import router from "./router";
import "./style.css";

const app = createApp(App);

app.use(SaxVue, {
  colors: {
    primary: "#5b3cc4",
    success: "rgb(23, 201, 100)",
    danger: "rgb(242, 19, 93)",
    warn: "rgb(255, 130, 0)",
    dark: "rgb(36, 33, 69)",
  },
});

app.use(router);
app.mount("#app");
