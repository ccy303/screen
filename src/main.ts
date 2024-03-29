import { createApp, h, onMounted } from "vue";
import App from "./App.vue";
//引入路由
import router from "./router";
//引入element-plus ui组件
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "./assets/scss/element-var.scss";
import "@/assets/scss/index.scss";
//状态管理
import { createPinia } from "pinia";

import Map from "./views/components/map.vue";

import "./js/ace/ace.js";
import "./js/ace/ext-language_tools.js";
import "./js/echarts.min.js";

import jsonData from "./data.json";
import testData from "./test.json";
import { useDataStore } from "@/store/data";

const Component = {
    setup() {
        onMounted(() => {});
        return () => h(App);
    }
};

const app = createApp(Component);
app.component("echartsMap", Map);
const pinia = createPinia();
app.use(pinia).use(router).use(ElementPlus, { locale: zhCn }).mount(document.querySelector("#app"));

setTimeout(() => {
    useDataStore().setData(testData);
});
