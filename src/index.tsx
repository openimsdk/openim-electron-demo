import ReactDOM from "react-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import enUS from "antd/lib/locale/en_US";
import "./i18n/index";
import App from "./pages/App";
import { useEffect, useState } from "react";
import { getLanguage } from "./config";
import { events } from "./utils";
import { ANTDLOCALCHANGE } from "./constants/events";
import { LanguageType } from "./@types/open_im";

const Index = () => {
  const [locale, setLocale] = useState(getLanguage());
  useEffect(() => {
    events.on(ANTDLOCALCHANGE, localeHandler);
    return () => {
      events.off(ANTDLOCALCHANGE, localeHandler);
    };
  }, []);

  const localeHandler = (locale: LanguageType) => {
    setLocale(locale);
  };
  return (
    <ConfigProvider locale={locale === "zh-cn" ? zhCN : enUS}>
      <App />
    </ConfigProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
