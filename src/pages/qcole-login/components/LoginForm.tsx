import { Input, Button, Checkbox, Form, Select, Spin, Upload, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { useToggle, useCountDown } from "ahooks";
import { findEmptyValue } from "../../../utils/common";
import { cosUpload } from "../../../utils";
import { MyAvatar } from "../../../components/MyAvatar";
import CodeBox from "./CodeBox";

import { useTranslation } from "react-i18next";
import { Itype } from "../../../@types/open_im";
import { getCosAuthorization } from "../../../utils/cos";
import { sendSms, verifyCode } from "../../../api/login";
import { sms_code } from "@/api/qcole";

const { Option } = Select;

export type FormField = {
  areaCode: string;
  phoneNo: string;
  password?: string;
  verifyCode: string;
};

export type InfoField = {
  userID: string;
  nickname: string;
  faceURL: string;
};

type IProps = {
  finish: (values?: FormField | string | InfoField) => void;
  type: Itype | undefined;
  back: () => void;
  getCodeAgain: () => void;
  loading: boolean;
  num: string;
};

const LoginForm: FC<IProps> = (props) => {
  const { type, loading, finish, back } = props;
  const { t } = useTranslation();
  const [btmSts, { set: setBtm }] = useToggle();
  const [backSts, { set: setBack }] = useToggle();
  const [sInfo, setSInfo] = useState<InfoField>({
    userID: "userID",
    nickname: "",
    faceURL: `ic_avatar_0${Math.ceil(Math.random() * 6)}`,
  });
  const [form] = Form.useForm();

  // 验证码的倒计时, = 0 显示获取验证码, > 0 显示倒计时
  const [targetDate, setTargetDate] = useState<number>();
  const [countdown] = useCountDown({
    targetDate,
  });

  useEffect(() => {
    const btmShow = ["login", "register"];
    const backShow = ["register", "vericode", "modifySend", "modifycode"];
    setBtm(btmShow.includes(type!));
    setBack(backShow.includes(type!));
  }, [type]);

  const phoneRules = [
    {
      message: t("PhoneRule"),
      pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
      validateTrigger: "onFinish",
    },
  ];

  const pwdRules = [
    {
      message: t("PassWordRule"),
      min: 6,
      max: 20,
      validateTrigger: "onFinish",
    },
  ];

  const verifyCodeRules = [
    {
      message: t("VerifyCodeRule"),
      min: 6,
      max: 6,
      validateTrigger: "onFinish",
    },
  ];

  const rePwdRules = [
    {
      message: t("PassWordRule"),
      min: 6,
      max: 20,
      validateTrigger: "onFinish",
    },
    (ctx: any) => ({
      validator(_: any, value: string) {
        if (!value || ctx.getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(t("PassWordRepeat")));
      },
    }),
  ];

  const initialValues = {
    areaCode: "86",
    phoneNo: type === "login" ? localStorage.getItem("lastimuid") ?? "" : "",
  };

  const comfirmEnter = (value: any) => {
    finish(value);
  };

  const switchBtnText = () => {
    switch (type) {
      case "login":
        return t("Login");
      case "register":
        return t("Register");
      case "modifySend":
        return t("GetVerifyCode");
    }
  };

  const sendVerifyCode = useCallback(() => {
    // 对手机号进行校验
    form
      .validateFields(["phoneNo"])
      .then((values) => {
        console.log(`🚀 ~ file: LoginForm.tsx ~ line 131 ~ form.validateFields ~ values`, values);
        // 手机号正确就调用接口
        sms_code(values.phoneNo)
          .then((response) => {
            message.info("验证码已发送");
            setTargetDate(Date.now() + 60 * 1000);
          })
          .catch((error) => {
            message.error("服务器发生错误，请联系管理员");
          });
      })
      // 手机号错误会被拦截
      .catch((errorInfo) => {});
  }, [form]);

  const loginAndRegisterForm = (
    <>
      <div className="form_logo"></div>

      <div className="form_title mb_gap">{type === "modifySend" ? t("MissPwd") : t("LoginFormTitle")}</div>

      <Form form={form} onFinish={comfirmEnter} layout="vertical" initialValues={initialValues}>
        <Form.Item label={t("PhoneNumber")} name="phoneNo" rules={phoneRules} className="mb_gap">
          <Input placeholder={t("PhoneNumberTip")} className="form_input" />
        </Form.Item>

        {type === "login" ? (
          <Form.Item label={t("Code")} className="mb_gap">
            <Input.Group size="large">
              <Form.Item name="verifyCode" rules={verifyCodeRules} noStyle>
                <Input style={{ width: "calc(100% - 150px)" }} className="form_input" />
              </Form.Item>

              <Button type="link" style={{ width: "150px" }} className="form_input" onClick={sendVerifyCode} disabled={countdown > 0}>
                {countdown === 0 ? "获取验证码" : `${Math.round(countdown / 1000)}秒重新获取`}
              </Button>
            </Input.Group>
          </Form.Item>
        ) : null}

        <Form.Item>
          <Button loading={loading} className="form_submit" htmlType="submit" type="primary">
            {switchBtnText()}
          </Button>
        </Form.Item>
      </Form>
    </>
  );

  const help = <span style={{ fontSize: "12px", color: "#428be5" }}>{t("PasswolrdNotice")}</span>;

  const setPwd = (
    <>
      <div className="form_title">
        {type === "setPwd" ? t("SetAccountTitle") : t("ModifyPwdTitle")}
        <div className="sub_title">{t("SetAccountSubTitle")}</div>
      </div>
      <Form
        form={form}
        onFinish={(v) => {
          finish(v);
          form.resetFields();
        }}
        layout="vertical"
      >
        <Form.Item name="password" label={t("Password")} rules={pwdRules} extra={help}>
          <Input.Password style={{ width: "100%" }} bordered={false} placeholder={t("PasswordTip")} />
        </Form.Item>

        <Form.Item name="rePassword" label={t("ComfirmPassword")} rules={rePwdRules} dependencies={["password"]}>
          <Input.Password style={{ width: "100%" }} bordered={false} placeholder={t("PasswordTip")} />
        </Form.Item>

        <Form.Item style={{ margin: "48px 0 0 0" }}>
          <Button loading={loading} htmlType="submit" type="primary">
            {t("NextStep")}
          </Button>
        </Form.Item>
      </Form>
    </>
  );

  const cusromUpload = async (data: UploadRequestOption) => {
    await getCosAuthorization();
    cosUpload(data).then((res) => setSInfo({ ...sInfo, faceURL: res.url }));
  };

  const setInfo = (
    <>
      <div className="form_title">
        {t("LoginFormTitle")}
        <div className="sub_title">{t("SetInfoSubTitle")}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Upload accept="image/*" name="avatar" action={""} customRequest={(data) => cusromUpload(data)} showUploadList={false}>
          <MyAvatar size={72} src={sInfo.faceURL} />
          <div
            style={{
              fontSize: "12px",
              color: "#777",
              marginTop: "8px",
              display: sInfo.faceURL === "" ? "block" : "none",
            }}
          >
            {t("SetAvatar")}
          </div>
        </Upload>
      </div>
      <div className="name_input">
        <div className="name_lable">{t("SetName")}</div>
        <Input
          allowClear={true}
          bordered={false}
          placeholder={t("SetNameNotice")}
          onChange={(v) =>
            setSInfo({
              ...sInfo,
              nickname: v.target.value,
            })
          }
        />
      </div>
      <Button
        loading={loading}
        style={{ marginTop: "48px" }}
        type="primary"
        onClick={() => {
          if (findEmptyValue(sInfo)) {
            finish(sInfo);
          }
        }}
      >
        {t("RegistrationCompleted")}
      </Button>
    </>
  );

  const loadingEl = (
    <div className="loading_spin">
      <Spin size="large" />
    </div>
  );

  const backIcon = (
    <div
      style={{
        position: "absolute",
        top: "14px",
        fontSize: "12px",
        color: "#777",
        cursor: "pointer",
      }}
      onClick={back}
    >
      <LeftOutlined />
      {t("Back")}
    </div>
  );

  const bottomAccess = (
    <div>
      {type === "login" ? (
        <div className="access_bottom">
          <span onClick={() => finish("modifySend")}>{t("MissPwd")}</span>
          <span onClick={() => finish("register")}>{t("RegisterNow")}</span>
        </div>
      ) : null}
    </div>
  );

  const getForm = () => {
    switch (type) {
      case "login":
      case "register":
      case "modifySend":
        return loginAndRegisterForm;
      case "vericode":
      case "modifycode":
        return <CodeBox {...props} />;
      case "setPwd":
      case "modify":
        return setPwd;
      case "setInfo":
        return setInfo;
      default:
        return loadingEl;
    }
  };

  return (
    <div className="login_form">
      {backSts && backIcon}
      {getForm()}
      {/* {btmSts && bottomAccess} */}
    </div>
  );
};

export default LoginForm;
