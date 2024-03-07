import { stringToObj, appendOrRemoveStyle, objToStringify } from "@/utils/design";
import type { ScreenData } from "./types";
import JSONData from "@/data.json";

export const getInitData = (id: string | number, route?: any) => {
    return new Promise((resolve, reject) => {
        const data = JSONData.data.data;
        const resultData = {
            ...data,
            config: {
                ...data.config,
                id: data.id
            }
        };
        if (resultData.config?.style) {
            appendOrRemoveStyle("screenStyle", resultData.config.style, true);
        }
        window.getScreenGlobal = data;
        resolve({
            screenData: resultData,
            globalData: JSONData
        });
    });
};

export const getReplaceGlobal = (data: ScreenData) => {
    //转为字符串好替换预定的数据标识
    //即将1. data:"{{getScreenGlobal.line.xAxis}}"转为data:getScreenGlobal.line.xAxis
    //2. text:"标题{{getScreenGlobal.title}}"转为 text:"标题xxx"
    const newStr = objToStringify(data)
        .replace(/"{{.*?}}"/g, function (match) {
            return match.slice(3, -3);
        })
        .replace(/{{.*?}}/g, function (match) {
            //2,-2即减去{{和}}，得到括号内的文本，作为函数执行
            return new Function("return " + match.slice(2, -2))();
        });
    return stringToObj(newStr);
};
