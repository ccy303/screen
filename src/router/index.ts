import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

const routes = [
  // {
  //   path: "/",
  //   name: "list",
  //   component: () => import("../views/list.vue"),
  // },
  // {
  //   path: "/test",
  //   name: "test",
  //   component: () => import("../views/test.vue"),
  // },
  // {
  //   path: "/screen",
  //   name: "screen",
  //   component: () => import("../views/screen/index.vue"),
  // },
  {
    path: "/",
    name: "show",
    component: () => import("../views/show.vue"),
  },

];

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes: routes,
});
export default router;
