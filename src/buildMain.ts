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
import { useDataStore } from "@/store/data";

import Map from "./views/components/map.vue";
import jsonData from "./data.json";
import "./js/ace/ace.js";
import "./js/ace/ext-language_tools.js";
import "./js/echarts.min.js";

const Component = {
    setup() {
        onMounted(() => {
            console.info("app加载初始化数据", jsonData);
            useDataStore().setData(jsonData);
        });
        return () => h(App);
    }
};

(function (KDApi) {
    function MyComponent(model) {
        this._setModel(model);
    }

    MyComponent.prototype = {
        _setModel: function (model) {
            this.model = model;
        },
        init: function (props) {
            console.log("-----init", this.model.style, props);
            setHtml(this.model, props);
        },
        update: function (props) {
            console.log("-----update", this.model, props);
            console.info("更新返回props", props);
            props.data && useDataStore().setData(props);
        },
        destoryed: function () {
            console.log("-----destoryed", this.model);
        }
    };

    const setHtml = (model, props) => {
        console.info("setHtml");
        KDApi.loadFile("./assets/style.css", model, () => {
            const pinia = createPinia();
            const app = createApp(Component);
            app.component("echartsMap", Map);
            app.provide("KDModel", model);
            app.provide("KDProps", props);
            app.use(pinia);
            app.use(router);
            app.use(ElementPlus, { locale: zhCn });
            setTimeout(() => {
                app.mount(model.dom);
            });
        });
    };

    KDApi.register("echartsvue", MyComponent);
})(window.KDApi);
