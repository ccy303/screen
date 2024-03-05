import { createApp } from "vue";
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

console.info("loadFile:js");

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
      // updateHtml(this.model, props)
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
    },
  };

  const setHtml = (model, props) => {
    console.info("setHtml");
    KDApi.loadFile("./assets/style.css", model, () => {
      console.info("loadFile:css");
      console.info("model", model);
      const pinia = createPinia();
      const app = createApp(App);
      app.component("echartsMap", Map);
      console.info("app", app);
      app.provide("KDModel", model);
      app.use(pinia);
      app.use(router);
      app.use(ElementPlus, { locale: zhCn });
      setTimeout(() => {
        // app.mount('#root');
        app.mount(model.dom);
      });
    });
  };

  KDApi.register("echartsvue", MyComponent);
})(window.KDApi);
