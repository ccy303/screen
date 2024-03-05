import request from "../utils/request";

const allApi: any = {
  designSave: "/api/screen/save", //设计保存接口
  designById: `/mock/id{id}.json`, //查看页面根据id查看
  designList: "/mock/list.json",
  demoEchartsData: "/mock/echarts.json",
  designEdit: "/api/screen/edit",
};

/**
 * 统一数据请求方法
 * @param apiKey // 定义的api key或是api请求接口url，也可在url前面带请求的方式
 * 1.定义好的key，如 'getLogin' => const allApi={getLogin:'/user/login'}
 * 2.不定义直接为接口url，如 '/user/login'
 * 3.url前带有请求的method类型，如 'get|/user/login'
 * @param data // 请求的参数，get时会在request.ts中将参数以params形式提交，即追加到url后面
 * @param options // 其他参数
 * 1.改变默认method => {method:'get'}，也可在url前添加，使用｜分隔
 * 2.改变或添加头部信息 => {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
 * 3.文档数据流时添加信息 => {responseType: 'blob'}
 * 4.解决apiKey带动态参数时，可添加$标识符 /api/delete/$id => {apiKey:{$id:xx}}
 */
export const getRequest = (
  apiKey: string,
  data: { [key: string]: any } = {},
  options: { [key: string]: any } = {}
) => {
  let url = allApi[apiKey] || apiKey;
  if (Object.keys(options.apiKey || {}).length) {
    for (const key in options.apiKey) {
      url = url.replace(key, options.apiKey[key]);
    }
  }
  let method: string = "POST"; // 默认请求方式
  // 如果url带有｜分隔符，提取｜前面的作为请求method并过滤掉｜前面的
  /*if (url.indexOf('|') !== -1) {
    method = url.split('|')[0]
    url = url.replace(/.*\|/, '')
  }*/
  //供演示
  if (apiKey === "designById") {
    url = url.replace("{id}", data.id);
  }
  //供演示结束
  let obj: any = Object.assign(
    {
      url: url, // 添加个前缀
      method: method,
      data,
    },
    options
  );
  return request(obj);
};

export const uploadUrl: string = "/api/upload"; // el-upload上传地址
