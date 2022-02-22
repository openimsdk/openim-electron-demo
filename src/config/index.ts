// export const AXIOSURL = "http://47.112.160.66:42233"
export const AXIOSURL = "http://121.37.25.71:42233"
// export const AXIOSURL = "http://43.128.5.63:42233"
export const AXIOSTIMEOUT = 60000
// export const IMURL = "ws://172.16.8.136:30000"
export const IMURL = "ws://121.37.25.71:30000"
// export const IMURL = "ws://172.16.9.247:30000"
export const ADMINURL = "http://121.37.25.71:10000"
// export const ADMINURL = "http://43.128.5.63:10000"
// export const IMURL = "ws://43.128.5.63:30000"
// export const IMURL = "ws://172.16.8.136:30000"
// export const IMURL = "ws://47.112.160.66:30000"
export const PICMESSAGETHUMOPTION = "?imageView2/1/w/200/h/200/rq/80"
export const LANGUAGE = "zh-cn"

export const getIMUrl = () => localStorage.getItem("IMUrl")?localStorage.getItem("IMUrl")!:IMURL
export const getAxiosUrl = () => localStorage.getItem("IMAxiosUrl")?localStorage.getItem("IMAxiosUrl")!:AXIOSURL
export const getAdminUrl = () => localStorage.getItem("IMAdminUrl")?localStorage.getItem("IMAdminUrl")!:ADMINURL
export const getLanguage = () => localStorage.getItem("IMLanguage")?localStorage.getItem("IMLanguage")!:LANGUAGE