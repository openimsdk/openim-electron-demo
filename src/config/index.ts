// 若为ip+端口形式测试  则仅需修改下方配置中的ip为您自己部署的服务器ip即可
// export const IM_WS_URL = "ws://121.5.182.23:10001";
// export const IM_API_URL = "http://121.5.182.23:10002";
// export const IM_REGISTER_URL = "http://121.5.182.23:10008";
// export const IM_CONFIG_URL = "http://121.5.182.23:10009";

// 若为https+域名方式  且参考了官方nginx配置(https://doc.rentsoft.cn/#/v2/server_deploy/easy_deploy_new?id=%e4%ba%94%e3%80%81nginx%e9%85%8d%e7%bd%ae%e5%8f%82%e8%80%83) 
// 则仅需修改下方配置中的域名为您自己部署的服务域名即可
export const IM_WS_URL = "wss://test-web.rentsoft.cn/msg_gateway"
export const IM_API_URL = "https://test-web.rentsoft.cn/api"
export const IM_REGISTER_URL = "https://test-web.rentsoft.cn/chat"
export const IM_CONFIG_URL = "http://test-web.rentsoft.cn/complete_admin";

// 高德地图 appKey  需自行申请
export const AMapKey = ''

export const AXIOS_TIMEOUT = 60000;
export const PIC_MESSAGE_THUMOPTION = "?imageView2/1/w/200/h/200/rq/80";
export const LANGUAGE = "zh-cn";

export const getIMWsUrl = () => (localStorage.getItem("IMWsUrl") ? localStorage.getItem("IMWsUrl")! : IM_WS_URL);
export const getIMRegisterUrl = () => (localStorage.getItem("IMRegisterUrl") ? localStorage.getItem("IMRegisterUrl")! : IM_REGISTER_URL);
export const getIMApiUrl = () => (localStorage.getItem("IMApiUrl") ? localStorage.getItem("IMApiUrl")! : IM_API_URL);
export const getIMConfigUrl = () => (localStorage.getItem("IM_CONFIG_URL") ? localStorage.getItem("IM_CONFIG_URL")! : IM_CONFIG_URL);
export const getLanguage = () => (localStorage.getItem("IMLanguage") ? localStorage.getItem("IMLanguage")! : LANGUAGE);
