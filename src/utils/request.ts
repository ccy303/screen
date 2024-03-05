import axios from 'axios'


const service = axios.create({
  baseURL: '',
  timeout: 3000, // request timeout
  headers: {}
})



/***************************4.无感刷新换token相关结束****************/
service.interceptors.request.use(
  (config: any) => {
    //让每个请求携带自定义token 请根据实际情况自行修改。
    /*const token: any = getStorage('token', true)
    if (token) {
      config.headers['Authorization'] = token
    }*/

    return config
  },
  (error: any) => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  (res: any) => {
    return res.data
  },
  (error: any) => {
    return Promise.reject(error)
  }
)
export default service
