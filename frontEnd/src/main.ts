import { createApp } from "vue";
import App from "@/App.vue";

import VueRouter from "@/router";
import { createPinia } from "pinia";
// scss
import "@/scss/style.scss";

// 注册插件
import { registerPlugins } from "@/plugins";

const app = createApp(App);

// 注册路由
app.use(VueRouter);
// 注册pinia
app.use(createPinia());

registerPlugins(app);

app.mount("#app");
