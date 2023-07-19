import log from "electron-log";

// log.transports.console.level = false;
log.transports.file.level = "debug";
log.transports.file.maxSize = 10024300; // 文件最大不超过 10M
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}";
// let date = new Date();
// let dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
// log.transports.file.resolvePath = () => "log\\" + dateStr + ".log";

export default log;
