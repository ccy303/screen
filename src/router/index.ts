import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "screen",
        component: () => import("../views/screen/index.vue")
    },
    {
        path: "/show",
        name: "show",
        component: () => import("../views/show.vue")
    },
    {
        path: "/test",
        name: "test",
        component: () => import("../views/test.vue")
    }
];

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes: routes
});
export default router;
