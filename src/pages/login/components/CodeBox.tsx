import { useInterval } from "ahooks";
import { Button } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
//@ts-ignore
import Codebox from "@/components/CodeBox";
import { Itype } from "../../../@types/open_im";
import { FormField, InfoField } from "./LoginForm";

type IProps = {
  finish: (values?: FormField | string | InfoField) => void;
  getCodeAgain: () => void;
  type: Itype | undefined;
  loading: boolean;
  num: string;
};

const CodeBox = ({ finish, getCodeAgain, type, loading, num }: IProps) => {
  const { t, i18n } = useTranslation();
  const [code, setCode] = useState("");
  const [time, setTime] = useState(60);
  const [interval, setInterval] = useState<number | null>(1000);

  const getAgainInCom = async () => {
    await getCodeAgain();
    setTime(60);
    setInterval(1000);
  };

  const ObtainZh = () => (
    <div className="sub_tip">
      <span>{time}s </span>后
      <span onClick={getAgainInCom} style={{ cursor: time === 0 ? "pointer" : "" }}>
        {` ${"重新获取"} `}
      </span>
      验证码
    </div>
  );

  const ObtainEn = () => (
    <div className="sub_tip">
      <span onClick={getAgainInCom} style={{ cursor: time === 0 ? "pointer" : "" }}>
        {t("GetAgain")}
      </span>
      {` ${t("Code")} `}
      <span>{time}s </span>
    </div>
  );

  useInterval(
    () => {
      setTime(time! - 1);
      if (time === 1) setInterval(null);
    },
    interval as number,
    { immediate: true }
  );

  return (
    <>
      <div className="form_title">{type == "vericode" ? t("VerifyCode") : t("LoginFormTitle")}</div>
      <div className="sub_tip">
        {t("SendCodeNotice1")}
        <span>{` +86 ${num} `}</span>
        {t("SendCodeNotice2")}
      </div>
      <Codebox
        length={6}
        type="text"
        validator={(input: string) => {
          return /\d/.test(input);
        }}
        onChange={(v: string[]) => {
          const vs = v.toString().replace(/,/g, "");
          setCode(vs);
          if (vs.length === 6) finish(vs);
        }}
      />
      {i18n.language === "zh-cn" ? <ObtainZh /> : <ObtainEn />}
      <Button loading={loading} style={{ marginTop: "72px" }} type="primary" onClick={() => finish(code)}>
        {t("NextStep")}
      </Button>
    </>
  );
};

export default CodeBox;
