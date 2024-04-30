import { createRouter, createWebHistory } from "vue-router";

import FullLayout from "@/components/FullLayout.vue"
import Sidebar from "@/components/SideBar.vue";
import LoginView from "@/views/authorization/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: FullLayout,
      redirect: "/history",
      children: [
        {
          path: "/history",
          name: "history",
          components: {
            default: () => import("@/views/modules/history/Index.vue"),
            sidebar: Sidebar,
          },
        },
        {
          path: "/facility",
          name: "Manage",
          components: {
            default: () => import("@/views/modules/manage/Index.vue"),
            sidebar: Sidebar,
          },
        },
        {
          path: "/system",
          name: "System",
          components: {
            default: () => import("@/views/modules/system/Index.vue"),
            sidebar: Sidebar,
          },
        },
        {
          path: "/patient",
          name: "Patient",
          components: {
            default: () => import("@/views/modules/patient/Index.vue"),
            sidebar: Sidebar,
          },
        },
        // 没有匹配到
        {
          path: "/:pathMatch(.*)*",
          name: "NotFound",
          components: {
            default: () => import("@/views/NotFound.vue"),
            sidebar: Sidebar,
          },
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      meta: {
        title: "ログイン",
      },
      component: LoginView,
    },
  ],
});

export default router;
