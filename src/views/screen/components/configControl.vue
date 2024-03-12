<!-- Created by weiXin:337547038 -->

<template>
    <div class="main-right" :class="{ lock: isLockDisplay }">
        <el-tabs class="tabs" model-value="position">
            <el-tab-pane label="属性配置" name="position">
                <el-form size="small">
                    <el-form-item label="版本筛选" v-if="current.optionversion">
                        <el-select v-model="currentOptionVersion" @change="optionVersionChange">
                            <el-tooltip :content="item.versiondescribe" v-for="(item, idx) in current.optionversion"
                                :key="idx">
                                <el-option :value="item.version">{{ item.version }}</el-option>
                            </el-tooltip>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="item.label" v-for="(item, index) in positionProperty" :key="index">
                        <h3 v-if="item.type === 'group'">{{ item.title }}</h3>
                        <el-switch v-else-if="item.type === 'switch'" :model-value="item.value"
                            @change="propertyChange(item, $event)" :class="[item.key]" />
                        <el-color-picker v-else-if="item.type === 'color'" show-alpha
                            @change="propertyChange(item, $event)" :model-value="item.value" />
                        <el-input type="textarea" v-else-if="item.type === 'textarea'" :placeholder="item.placeholder"
                            @change="propertyChange(item, $event)" :model-value="item.value" />
                        <el-select v-else-if="item.type === 'select'" :allowCreate="item.allowCreate"
                            :filterable="item.filterable" :placeholder="item.placeholder"
                            @change="propertyChange(item, $event)" :model-value="item.value">
                            <el-option v-for="(opt, key) in item.options" :key="opt" :label="opt" :value="key" />
                        </el-select>
                        <el-input-number v-else-if="item.type === 'number'" controls-position="right"
                            :placeholder="item.placeholder" :model-value="item.value"
                            @input="propertyChange(item, $event)" />
                        <el-input v-else :placeholder="item.placeholder" :model-value="item.value"
                            @input="propertyChange(item, $event)" />
                    </el-form-item>
                    <el-form-item v-if="['image', 'background'].includes(type as string)" class="upload-image">
                        <el-input placeholder="请输入图片地址" v-model="current.config.src" />
                        <el-button type="primary"
                            @click="openUpload(type === 'image' ? 'img' : 'bg', 'src')">选择图片</el-button>
                    </el-form-item>
                    <el-form-item v-if="['line', 'bar', 'pie', 'echarts'].includes(type as string)">
                        <el-button type="primary" @click="openDrawer('echartsEdit')">图表编辑</el-button>
                    </el-form-item>
                    <el-form-item
                        v-if="['text', 'sText', 'image', 'background', 'border', 'clock'].includes(type as string)">
                        <el-button type="primary" @click="openDrawer('style')">编辑更多内联样式</el-button>
                    </el-form-item>
                    <el-form-item v-if="['table'].includes(type as string)">
                        <el-button type="primary" @click="openDrawer('tablePropsEdit')">表格属性</el-button>
                    </el-form-item>
                </el-form>
                <el-form size="small"
                    v-if="['line', 'bar', 'pie', 'echarts', 'text', 'sText', 'table'].includes(type as string)">
                    <el-form-item label="版本">
                        <el-input v-model="current.config.version" type="text" placeholder="请输入版本"
                            @change="propertyChange({ key: 'version' }, $event)" />
                    </el-form-item>
                    <el-form-item label="版本描述">
                        <el-input v-model="current.config.versiondescribe" type="text" placeholder="请输入版本描述"
                            @change="propertyChange({ key: 'versiondescribe' }, $event)" />
                    </el-form-item>
                    <el-form-item label="是否发布">
                        <el-radio-group v-model="current.config.ispublish"
                            @change="e => propertyChange({ key: 'ispublish' }, e)">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <h3>数据</h3>
                    </el-form-item>
                    <el-form-item label="数据类型">
                        <el-radio-group v-model="current.config.optionsType">
                            <el-radio :label="0" style="margin-right: 4px">静态/全局</el-radio>
                            <el-radio :label="1">动态</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="current.config.optionsType !== 1">
                        <el-button type="primary" @click="openDrawer('editData')">编辑数据</el-button>
                    </el-form-item>
                    <template v-if="current.config.optionsType === 1">
                        <el-form-item label="插件标识">
                            <el-input v-model="current.pluginname" placeholder="插件标识" />
                        </el-form-item>
                    </template>
                    <template v-if="current.id">
                        <el-form-item>
                            <el-button type="primary" @click="saveChartoption">保存配置</el-button>
                        </el-form-item>
                    </template>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="大屏配置" name="screen">
                <el-form size="small" :rules="[]">
                    <el-form-item label="版本筛选" v-if="config.configversion">
                        <el-select v-model="currentConfigVersion" @change="configVersionChange">
                            <el-tooltip :content="item.versiondescribe" v-for="(item, idx) in config.configversion"
                                :key="idx">
                                <el-option :value="item.version">{{ item.version }}</el-option>
                            </el-tooltip>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="大屏名称">
                        <el-input placeholder="请输入大屏名称" :model-value="config.name"
                            @input="configChange('name', $event)" />
                    </el-form-item>
                    <el-form-item label="大屏标识">
                        <div style="display: flex; align-items: center">
                            <el-input placeholder="请输入大屏标识" :model-value="config.configtag"
                                @input="configChange('configtag', $event)" />
                            <el-button type="primary" @click="screenSearch">查询</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="版本">
                        <el-input placeholder="请输入版本" :model-value="config.version"
                            @input="configChange('version', $event)" />
                    </el-form-item>
                    <el-form-item label="版本表述">
                        <el-input placeholder="请输入版本表述" :model-value="config.versiondescribe"
                            @input="configChange('versiondescribe', $event)" />
                    </el-form-item>
                    <el-form-item label="是否发布">
                        <el-radio-group :model-value="config.ispublish" @change="e => configChange('ispublish', e)">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="版本表述">
                        <el-input placeholder="主题编码" :model-value="config.themecode"
                            @input="configChange('themecode', $event)" />
                    </el-form-item>
                    <el-form-item label="版本表述">
                        <el-input placeholder="主题名称" :model-value="config.themename"
                            @input="configChange('themename', $event)" />
                    </el-form-item>
                    <el-form-item label="大屏宽度">
                        <el-input placeholder="请输入大屏宽度" :model-value="config.width"
                            @input="configChange('width', $event)" />
                    </el-form-item>
                    <el-form-item label="大屏高度">
                        <el-input placeholder="请输入大屏高度" :model-value="config.height"
                            @input="configChange('height', $event)" />
                    </el-form-item>
                    <el-form-item class="color-picker" label="主色">
                        <el-color-picker show-alpha @change="configChange('primary', $event)"
                            :model-value="config.primary" />
                    </el-form-item>
                    <el-form-item label="背景">
                        <el-select v-model="state.bgSelect" @change="stateChange">
                            <el-option :value="1" label="背景色" />
                            <el-option :value="2" label="渐变色" />
                            <el-option :value="3" label="背景图" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="state.bgSelect !== 3" class="color-picker">
                        <el-color-picker show-alpha v-model="state.bgColor" @change="stateChange" />
                    </el-form-item>
                    <template v-if="state.bgSelect === 2">
                        <el-form-item class="color-picker">
                            <el-color-picker show-alpha v-model="state.bgLinear" @change="stateChange" />
                        </el-form-item>
                        <el-form-item label="渐变角度">
                            <el-slider v-model="state.bgAngle" :max="360" @change="stateChange" />
                        </el-form-item>
                    </template>
                    <el-form-item v-if="state.bgSelect === 3" class="upload-image">
                        <el-input placeholder="请输入图片地址" v-model="state.bgUpload" @change="stateChange" />
                        <el-button type="primary" @click="openUpload('bg', 'screenBg')">上传</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="openDrawer('editCss')">编辑样式</el-button>
                    </el-form-item>
                    <el-form-item label="刷新时间">
                        <el-input-number disabled :model-value="config.loopTime"
                            @input="configChange('loopTime', $event)" />
                    </el-form-item>
                    <template v-if="config.id">
                        <el-form-item>
                            <el-button type="primary" @click="saveScreenOption">保存配置</el-button>
                        </el-form-item>
                    </template>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <upload-image ref="uploadImageEl" @click="selectImg" />
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, inject } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import type { Config, OpenDrawer } from "../types";
import UploadImage from "./upload.vue";
import { useDesignStore } from "@/store/design";

// import { useDataStore } from "@/store/data";
// import { copy } from 'copy-anything'

const KDModel = inject("KDModel");

const props: any = withDefaults(
    defineProps<{
        config: Config;
    }>(),
    {}
);

const currentOptionVersion = ref();
const currentConfigVersion = ref();

const emits: any = defineEmits<{
    (e: "update:config", val: Config): void;
    (e: "openDrawer", val: OpenDrawer): void;
    (e: "update"): void;
}>();

const designStore = useDesignStore();

const current: any = computed(() => {
    return designStore.screenControlAttr;
});

watch(
    () => current.value,
    n => {
        currentOptionVersion.value = n.config?.version;
    }
);

watch(
    () => props.config,
    n => {
        currentConfigVersion.value = n.version;
    },
    {
        immediate: true
    }
);

const isLockDisplay = computed(() => {
    return current.value?.config?.lock || current.value?.position?.display;
});

const uploadImageEl = ref();

const type = computed(() => {
    return current.value.type;
});

// ---------------------大屏配置开始---------------------
const updateConfig = (val: any) => {
    emits("update:config", Object.assign({}, props.config, val));
};

const state = reactive({
    bgColor: "",
    bgLinear: "",
    bgAngle: 0,
    bgUpload: "",
    bgSelect: ""
});

const unWatch = watch(
    () => props.config,
    (val: any) => {
        if (!Object.keys(current.value).length) {
            // 大屏配置
            const bg = val.background || "";
            if (bg.indexOf("url") !== -1) {
                const iReg = new RegExp("(?<=url\\()(.*?)(?=\\))", "g");
                const img = bg.match(iReg);
                Object.assign(state, {
                    bgUpload: img,
                    bgSelect: 3
                });
            } else if (bg.indexOf("linear") !== -1) {
                const str = bg.substring(bg.indexOf("(") + 1, bg.lastIndexOf(")"));
                const split = str.split(/,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/);
                Object.assign(state, {
                    bgColor: split[1].trim(),
                    bgLinear: split[2].trim(),
                    bgAngle: Number(split[0].replace("deg", "")),
                    bgSelect: 2
                });
            } else {
                Object.assign(state, {
                    bgColor: bg,
                    bgSelect: 1
                });
            }
        }
    },
    { immediate: true }
);

const stateChange = () => {
    let bg = "";
    switch (state.bgSelect) {
        case 1:
            bg = state.bgColor;
            break;
        case 2:
            bg = `linear-gradient(${state.bgAngle}deg, ${state.bgColor}, ${state.bgLinear})`;
            break;
        case 3:
            bg = `url(${state.bgUpload})`;
            break;
    }
    configChange("background", bg);
};

const configChange = (key: string, val: any) => {
    updateConfig({ [key]: val });
};

// ---------------------大屏配置结束---------------------
const positionProperty: any = computed(() => {
    if (Object.keys(current.value).length) {
        const { config = {}, position, type, option = {} }: { config: any; position: any; type: any; option: any } = current.value;
        return [
            {
                type: "group",
                title: "位置信息"
            },
            {
                label: "width",
                value: position.width,
                placeholder: "请输入宽度",
                key: "width",
                path: "position"
            },
            {
                label: "height",
                value: position.height,
                placeholder: "请输入高度",
                key: "height",
                path: "position"
            },
            {
                label: "left",
                value: position.left,
                placeholder: "图层位置",
                key: "left",
                path: "position"
            },
            {
                label: "top",
                value: position.top,
                key: "top",
                path: "position"
            },
            {
                label: "right",
                value: position.right,
                placeholder: "设置后left为auto",
                key: "right",
                path: "position"
            },
            {
                label: "bottom",
                value: position.bottom,
                placeholder: "设置后top为auto",
                key: "bottom",
                path: "position"
            },
            {
                type: "number",
                label: "zIndex",
                value: position.zIndex,
                placeholder: "请输入层级",
                key: "zIndex",
                path: "position"
            },
            {
                type: "group",
                title: "图表配置",
                vShow: ["line", "bar"]
            },
            {
                label: "标题",
                value: option.title?.text,
                placeholder: "请输入标题",
                key: "title.text",
                path: "option",
                vShow: ["line", "bar"]
            },
            {
                label: "标题字号",
                value: option.title?.textStyle?.fontSize,
                placeholder: "标题字号",
                key: "title.textStyle.fontSize",
                path: "option",
                vShow: ["line", "bar"]
            },
            {
                label: "字体颜色",
                value: option.title?.textStyle?.color,
                placeholder: "标题字号",
                key: "title.textStyle.color",
                path: "option",
                vShow: ["line", "bar"],
                type: "color"
            },
            {
                label: "二级标题",
                value: option.title?.subtext,
                placeholder: "标题字号",
                key: "title.subtext",
                path: "option",
                vShow: ["line", "bar"]
            },
            {
                type: "group",
                title: "属性信息"
            },
            {
                type: "switch",
                label: "锁定", // 属性仅在设计模式有效
                value: config.lock,
                key: "lock"
            },
            {
                type: "switch",
                label: "隐藏",
                value: position.display,
                key: "display",
                path: "position"
            },
            {
                label: "样式类名",
                placeholder: "方便引用个性化样式",
                value: config.class,
                key: "class"
            },
            {
                label: "文本内容",
                placeholder: "请输入文本内容",
                value: config.text,
                key: "text",
                vShow: ["text"]
            },
            {
                type: "select",
                label: "滚动方向",
                placeholder: "请选择滚动方向",
                value: config.direction,
                key: "direction",
                vShow: ["sText"],
                options: {
                    left: "从左到右",
                    right: "从右到左",
                    top: "从上到下",
                    bottom: "从下到上"
                }
            },
            {
                type: "number",
                label: "滚动速度",
                placeholder: "滚动速度，数字越大速度越慢",
                value: config.speed,
                key: "speed",
                vShow: ["sText"]
            },
            {
                type: "number",
                label: "滚动步长",
                placeholder: "每单位时间滚动的距离，默认1",
                value: config.step,
                key: "step",
                vShow: ["sText"]
            },
            {
                type: "textarea",
                label: "文本内容",
                placeholder: "请输入文本内容，支持html",
                value: config.text,
                key: "text",
                vShow: ["sText"]
            },
            {
                label: "字体大小",
                placeholder: "文本字体大小,如14px",
                value: config.style?.fontSize,
                key: "fontSize",
                path: "style",
                vShow: ["text", "clock"]
            },
            {
                label: "边框",
                placeholder: "如1px solid #000",
                value: config.style?.border,
                key: "border",
                path: "style",
                vShow: ["border"]
            },
            {
                type: "color",
                label: "背景颜色",
                value: config.style?.background,
                key: "background",
                path: "style",
                vShow: ["border"]
            },
            {
                type: "color",
                label: "字体颜色",
                value: config.style?.color,
                key: "color",
                path: "style",
                vShow: ["text", "clock"]
            },
            {
                type: "select",
                label: "时间格式",
                value: config.dateTime,
                key: "dateTime",
                allowCreate: true,
                filterable: true,
                placeholder: "选择或创建时间格式",
                vShow: ["clock"],
                options: {
                    "{y}-{m}-{d}": "{y}-{m}-{d}",
                    "{h}:{i}:{s}": "{h}:{i}:{s}",
                    "{y}-{m}-{d} {h}:{i}:{s}": "{y}-{m}-{d} {h}:{i}:{s}",
                    "{y}年{m}月{d}日 {h}:{i}:{s} 星期{w}": "{y}年{m}月{d}日 {h}:{i}:{s} 星期{w}"
                }
            },
            {
                label: "组件名称",
                value: config.component,
                placeholder: "全局注册的组件名称",
                key: "component",
                vShow: ["component"]
            },
            {
                type: "switch",
                label: "是否轮播", // 属性仅在设计模式有效
                value: config.carousel,
                key: "carousel",
                vShow: ["table"]
            },
            {
                type: "number",
                label: "滚动速度",
                placeholder: "开启轮播有效",
                value: config.speed,
                key: "speed",
                vShow: ["table"]
            }
        ].filter((item: any) => {
            let hasFilter = true;
            if (item.vShow) {
                hasFilter = item.vShow.includes(type);
            }
            if (item.vHide) {
                hasFilter = !item.vHide.includes(type);
            }
            return hasFilter;
        });
    }
    return [];
});

const propertyChange = (obj: any, value: any) => {
    if (obj.path === "position") {
        current.value.position[obj.key] = value;
    } else if (obj.path === "style") {
        // 内联样式
        if (!current.value.config?.style) {
            current.value.config.style = {};
        }
        current.value.config.style[obj.key] = value;
    } else if (obj.path === "option") {
        //图表配置
        if (obj.key.includes(".")) {
            const propertyPath = obj.key.split(".");
            // 动态地添加属性
            let currentObject = current.value.option; // 从根对象开始
            for (let i = 0; i < propertyPath.length - 1; i++) {
                currentObject[propertyPath[i]] = currentObject[propertyPath[i]] || {}; // 如果属性不存在，则初始化一个空对象
                currentObject = currentObject[propertyPath[i]]; // 移动到下一个属性
            }
            currentObject[propertyPath[propertyPath.length - 1]] = value; // 设置最后一个属性的值
        } else {
            current.value.option[obj.key] = value;
        }
    } else {
        current.value.config[obj.key] = value;
    }
    if (["zIndex", "display", "lock"].includes(obj.key)) {
        // 这三个更新，需要重设左侧图层
        emits("update");
    }
};

/***
 * 选择上传图片
 * @param tabsName 转到对应的选项卡
 * @param key 关闭弹窗时用于区分事件标识
 */
const openUpload = (tabsName: string, key: string) => {
    uploadImageEl.value.open(tabsName, key);
};

const selectImg = (path: string, key: string) => {
    switch (key) {
        case "screenBg":
            state.bgUpload = path;
            stateChange();
            break;
        case "src":
            current.value.config.src = path;
            break;
    }
};

// ace编辑器相关
const openDrawer = (type: string, isGlobal?: boolean) => {
    let codeType: string = "";
    let editData;
    let title: string = "";
    let tips = "";
    let eventType = type;
    if (type === "afterFetchScreen") {
        eventType = "afterFetch";
    }
    switch (type) {
        case "editCss":
            codeType = "css";
            break;
        case "beforeFetch":
        case "afterFetch":
        case "afterFetchScreen":
            if (isGlobal) {
                if (type === "afterFetch") {
                    tips = "这里返回的数据在当前页面可使用getScreenGlobal()方法获取";
                }
                editData = props.config && (props.config as any)[eventType];
            } else {
                editData = current.value.events && current.value.events[eventType];
            }
            break;
        case "style":
            codeType = "json";
            editData = current.value.config?.style || {};
            title = "可输入更多的css样式，须为json格式";
            break;
        case "echartsEdit":
            editData = current.value.option;
            title = "可参考echarts相关例子编辑";
            break;
        case "tablePropsEdit":
            codeType = "json";
            editData = current.value.config?.props || {};
            title = "支持所有表格props属性，可参考el-table。json格式";
            break;
        case "editData":
            // 静态
            const typeVal = current.value.type;
            title = "图表数据，替换相关数据返回即可";
            if (["text", "sText"].includes(typeVal)) {
                editData = current.value.config?.text;
                title = "编辑文本内容数据";
            } else {
                editData = current.value.option;
            }
            if (typeVal === "table") {
                title = "表格列表数据。根据设定的table-column列数据设置对应的数据";
            }
            break;
    }
    const emitsParams = {
        content: editData,
        codeType: codeType,
        type: type,
        title: title,
        tips: tips,
        callback: (result: any) => {
            switch (type) {
                case "beforeFetch":
                case "afterFetch":
                case "afterFetchScreen":
                    if (isGlobal) {
                        (props.config as any)[eventType] = result;
                    } else {
                        if (!current.value.events) {
                            current.value.events = {};
                        }
                        current.value.events[eventType] = result;
                    }
                    break;
                case "style":
                    current.value.config.style = result;
                    break;
                case "echartsEdit":
                    current.value.option = result;
                    break;
                case "tablePropsEdit":
                    current.value.config.props = result;
                    break;
                case "editData":
                    const typeVal = current.value.type;
                    if (["text", "sText"].includes(typeVal)) {
                        current.value.config.text = result;
                    } else {
                        current.value.option = result;
                    }
                    break;
            }
        }
    };
    emits("openDrawer", emitsParams);
};

const saveChartoption = () => {
    KDModel.invoke("saveoption", JSON.stringify(current.value));
};

const saveScreenOption = () => {
    KDModel.invoke("saveconfig", JSON.stringify(props.config));
};

const screenSearch = () => {
    KDModel.invoke("selectconfig", props.config.configtag);
};

const optionVersionChange = (id: any) => {
    // const idx = useDataStore().data.list.findIndex(item => item.id == current.value.id);
    // if (idx != -1) {
    //     const { data: originData } = useDataStore();
    //     const list = [...originData.list];
    //     const data = { ...list[idx], }
    //     list.splice(idx, 1, data);
    //     useDataStore().setData(copy({ ...originData, list: [...list] }));
    //     designStore.setScreenControlAttr(data)
    // }
    const target = current.value.optionversion.find((item: any) => item.version == id);
    KDModel.invoke("optionversion", JSON.stringify(target));
};

const configVersionChange = (id: any) => {
    const target = props.config.configversion.find((item: any) => item.version == id);
    KDModel.invoke("configversion", JSON.stringify(target));
};

onBeforeRouteLeave(() => {
    unWatch(); //销毁监听器
});
</script>
