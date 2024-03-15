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
import { useDesignStore } from "@/store/design";

import Map from "./views/components/map.vue";
// import jsonData from "./data.json";
import "./js/ace/ace.js";
import "./js/ace/ext-language_tools.js";
import "./js/echarts.min.js";
import { copy } from "copy-anything";

const Component = {
    setup() {
        onMounted(() => {
            // console.info("app加载初始化数据", jsonData);
            // useDataStore().setData(jsonData);
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
            if (props.data.data.invokeKey == "selectconfig") {
                console.info("selectconfig", props.data);
                props.data && useDataStore().setData(props.data.data);
            } else if (["refresh", "optionversion"].includes(props.data.data.invokeKey)) {
                console.info(props.data.data.invokeKey, props.data);
                const { data: originData } = useDataStore();
                const idx = originData.list.findIndex((item: any) => item.id == props.data.data.id);
                if (idx != -1) {
                    const list = [...originData.list];
                    const data = { ...list[idx] };
                    list.splice(idx, 1, data);
                    useDataStore().setData(copy({ ...originData, list: [...list] }));
                    useDesignStore().setScreenControlAttr(data);
                }
            } else if (props.data.data.invokeKey == "configversion") {
                console.info("configversion", props.data);
                props.data && useDataStore().setData(props.data.data);
            }
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
