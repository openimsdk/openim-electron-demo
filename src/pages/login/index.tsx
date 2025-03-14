import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";

import login_bg from "@/assets/images/login/login_bg.png";
import WindowControlBar from "@/components/WindowControlBar";
import { APP_NAME, APP_VERSION, SDK_VERSION } from "@/config";
import { feedbackToast } from "@/utils/common";
import { getLoginMethod, setLoginMethod as saveLoginMethod } from "@/utils/storage";

import styles from "./index.module.scss";
import LoginForm from "./LoginForm";
import ModifyForm from "./ModifyForm";
import RegisterForm from "./RegisterForm";

export type FormType = 0 | 1 | 2;

export const Login = () => {
  // 0login 1resetPassword 2register
  const [formType, setFormType] = useState<FormType>(0);
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">(getLoginMethod());

  const [_, copyToClipboard] = useCopyToClipboard();

  const updateLoginMethod = useCallback((method: "phone" | "email") => {
    setLoginMethod(method);
    saveLoginMethod(method);
  }, []);

  const handleCopy = () => {
    copyToClipboard(`${`${APP_NAME} ${APP_VERSION}`}/${SDK_VERSION}`);
    feedbackToast({ msg: t("toast.copySuccess") });
  };

  return (
    <div className="relative flex h-full flex-col">
      <div className="app-drag relative h-10 bg-[var(--top-search-bar)]">
        <WindowControlBar />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <LeftBar />
        <div
          className={`${styles.login} mr-14 h-[450px] w-[350px] rounded-md p-11`}
          style={{ boxShadow: "0 0 30px rgba(0,0,0,.1)" }}
        >
          {formType === 0 && (
            <LoginForm
              setFormType={setFormType}
              loginMethod={loginMethod}
              updateLoginMethod={updateLoginMethod}
            />
          )}
          {formType === 1 && (
            <ModifyForm setFormType={setFormType} loginMethod={loginMethod} />
          )}
          {formType === 2 && (
            <RegisterForm loginMethod={loginMethod} setFormType={setFormType} />
          )}
        </div>
      </div>
      <div
        className="absolute bottom-3 right-3 flex cursor-pointer flex-col items-center text-xs"
        onClick={handleCopy}
      >
        <div className="text-[var(--sub-text)]">{`${APP_NAME} ${APP_VERSION}`}</div>
        <div className="text-[var(--sub-text)]">{SDK_VERSION}</div>
      </div>
    </div>
  );
};

const LeftBar = () => {
  return (
    <div className="flex min-h-[420]">
      <div className="mr-14 text-center">
        <div className="text-2xl">{t("placeholder.title")}</div>
        <span className="text-sm  text-gray-400">{t("placeholder.subTitle")}</span>
        <img src={login_bg} alt="login_bg" />
      </div>
    </div>
  );
};
