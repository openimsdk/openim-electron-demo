import "./index.scss";
import "./i18n/index";

import log from "electron-log/renderer";
import ReactDOM from "react-dom/client";

import App from "./App";
import { isSaveLog } from "./config";

if (window.electronAPI && isSaveLog) {
  const sdkLogger = log.scope("openim-sdk-core");
  console.debug = sdkLogger.debug.bind(sdkLogger);
  const rendererLogger = log.scope("renderer");
  console.info = rendererLogger.info.bind(rendererLogger);
  console.error = rendererLogger.error.bind(rendererLogger);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);

postMessage({ payload: "removeLoading" }, "*");
