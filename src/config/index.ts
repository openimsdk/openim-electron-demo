export const IM_REGISTER_URL = "http://121.5.182.23:10008"
export const AXIOS_TIMEOUT = 60000
export const IM_API_URL = "http://121.5.182.23:10002"
export const IM_WS_URL = "ws://121.5.182.23:10001"
export const PIC_MESSAGE_THUMOPTION = "?imageView2/1/w/200/h/200/rq/80"
export const LANGUAGE = "zh-cn"

export const getIMWsUrl = () => localStorage.getItem("IMWsUrl")?localStorage.getItem("IMWsUrl")!:IM_WS_URL
export const getIMRegisterUrl = () => localStorage.getItem("IMRegisterUrl")?localStorage.getItem("IMRegisterUrl")!:IM_REGISTER_URL
export const getIMApiUrl = () => localStorage.getItem("IMApiUrl")?localStorage.getItem("IMApiUrl")!:IM_API_URL
export const getLanguage = () => localStorage.getItem("IMLanguage")?localStorage.getItem("IMLanguage")!:LANGUAGE