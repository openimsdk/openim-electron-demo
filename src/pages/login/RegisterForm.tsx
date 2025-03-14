import { LeftOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, InputRef, Select, Space } from "antd";
import clsx from "clsx";
import { t } from "i18next";
import md5 from "md5";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRegister, useSendSms, useVerifyCode } from "@/api/login";
import { setAreaCode, setEmail, setIMProfile, setPhoneNumber } from "@/utils/storage";

import { areaCode } from "./areaCode";
import type { FormType } from "./index";

type RegisterFormProps = {
  loginMethod: "phone" | "email";
  setFormType: (type: FormType) => void;
};

type FormFields = {
  email?: string;
  phoneNumber?: string;
  areaCode: string;
  verifyCode: string;
  nickname: string;
  password: string;
  password2: string;
};

const RegisterForm = ({ loginMethod, setFormType }: RegisterFormProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormFields>();
  const navigate = useNavigate();
  const { mutate: sendSms } = useSendSms();
  const { mutate: verifySmsCode } = useVerifyCode();
  const { mutate: register } = useRegister();

  // 0login 1resetPassword 2register
  const [registerForm, setRegisterForm] = useState(0);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<InputRef[]>([]);
  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    const newCode = [...code];

    if (value.length === 1) {
      newCode[index] = value;
      setCode(newCode);

      if (index < code.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value.length === 0) {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    }

    const isFilled = newCode.every((input) => input.length > 0);
    if (isFilled) {
      form.submit();
    }
  };
  const handleInputKeyUp = (index: number, event: React.KeyboardEvent) => {
    const keyPressed = event.keyCode || event.which;

    if (keyPressed === 8 && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1].focus();
    }

    if (keyPressed === 8 || keyPressed === 46) {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    }
  };

  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
        if (countdown === 1) {
          clearTimeout(timer);
          setCountdown(0);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onFinish = (fields: FormFields) => {
    if (registerForm === 0) {
      const pattern = /^1\d{10}$/;
      if (fields.phoneNumber && !pattern.test(fields.phoneNumber)) {
        return message.error(t("toast.inputCorrectPhoneNumber"));
      }
      sendSms(
        {
          usedFor: 1,
          ...fields,
        },
        {
          onSuccess() {
            setCountdown(60);
            setRegisterForm(1);
            setTimeout(() => inputRefs.current[0].focus());
          },
        },
      );
    }
    const verifyCode = code.join("");

    if (registerForm === 1) {
      if (!verifyCode) return;
      verifySmsCode(
        {
          ...fields,
          verifyCode,
          usedFor: 1,
        },
        {
          onSuccess() {
            setRegisterForm(2);
          },
        },
      );
    }
    if (registerForm === 2) {
      setAreaCode(fields.areaCode);
      if (fields.phoneNumber) {
        setPhoneNumber(fields.phoneNumber);
      }
      if (fields.email) {
        setEmail(fields.email);
      }

      register(
        {
          verifyCode,
          autoLogin: true,
          user: {
            nickname: fields.nickname,
            faceURL: "",
            areaCode: fields.areaCode,
            phoneNumber: fields.phoneNumber,
            password: md5(fields.password),
            email: fields.email,
          },
        },
        {
          onSuccess(res) {
            message.success(t("toast.registerSuccess"));
            const { chatToken, imToken, userID } = res.data;
            setIMProfile({ chatToken, imToken, userID });
            navigate("/chat");
          },
        },
      );
    }
  };

  const sendSmsHandle = () => {
    sendSms(
      {
        email: form.getFieldValue("email") as string,
        phoneNumber: form.getFieldValue("phoneNumber") as string,
        areaCode: form.getFieldValue("areaCode") as string,
        usedFor: 1,
      },
      {
        onSuccess() {
          setCountdown(60);
        },
      },
    );
  };

  const back = () => {
    setFormType(0);
    form.resetFields();
  };

  const isEmail = loginMethod === "email";

  const verifyTitile = !isEmail
    ? "placeholder.verifyPhoneNumber"
    : "placeholder.verifyEmail";

  const receiver = isEmail
    ? (form.getFieldValue("email") as string)
    : `${form.getFieldValue("areaCode")} ${form.getFieldValue("phoneNumber")}`;

  return (
    <div className="flex flex-col justify-between">
      <div className="cursor-pointer text-sm text-gray-400" onClick={back}>
        <LeftOutlined rev={undefined} />
        <span className="ml-1">{t("placeholder.getBack")}</span>
      </div>
      <div className={clsx("mt-4 text-2xl font-medium")}>
        {registerForm === 0 && <span>{t("placeholder.register")}</span>}
        {registerForm === 1 && <span>{t(verifyTitile)}</span>}
        {registerForm === 2 && <span>{t("placeholder.setInfo")}</span>}
      </div>
      <div className="mt-4 tracking-wider text-gray-400" hidden={registerForm !== 1}>
        <span>{t("placeholder.pleaseEnterSendTo")}</span>
        <span className=" text-blue-600">{receiver}</span>
        <span>{t("placeholder.verifyValidity")}</span>
      </div>
      <Form
        form={form}
        layout="vertical"
        labelCol={{ prefixCls: "custom-form-item" }}
        onFinish={onFinish}
        autoComplete="off"
        className="mt-4"
        initialValues={{ areaCode: "+86" }}
      >
        {loginMethod === "phone" ? (
          <Form.Item label={t("placeholder.phoneNumber")} hidden={registerForm !== 0}>
            <Space.Compact className="w-full">
              <Form.Item name="areaCode" noStyle>
                <Select options={areaCode} className="!w-28" />
              </Form.Item>
              <Form.Item name="phoneNumber" noStyle>
                <Input allowClear placeholder={t("toast.inputPhoneNumber")} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        ) : (
          <Form.Item
            label={t("placeholder.email")}
            name="email"
            rules={[{ type: "email", message: t("toast.inputCorrectEmail") }]}
            hidden={registerForm !== 0}
          >
            <Input allowClear placeholder={t("toast.inputEmail")} />
          </Form.Item>
        )}

        <Form.Item label="" hidden={registerForm !== 1} className="mb-14 mt-8">
          <div className="flex flex-row items-center justify-center">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(input: InputRef) => (inputRefs.current[index] = input)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e)}
                onKeyUp={(e) => handleInputKeyUp(index, e)}
                className="mr-1 h-11 w-11 text-center text-2xl"
              />
            ))}
          </div>
          <div className="mt-4 text-gray-400">
            {countdown > 0 ? (
              <>
                <span className=" text-blue-500">{countdown}s </span>
                <span>{t("placeholder.regain") + t("placeholder.verifyCode")}</span>
              </>
            ) : (
              <>
                <span onClick={sendSmsHandle} className="cursor-pointer text-blue-500">
                  {t("placeholder.regain")}
                </span>
                <span>{t("placeholder.verifyCode")}</span>
              </>
            )}
          </div>
        </Form.Item>

        {registerForm === 2 && (
          <>
            <Form.Item
              label={t("placeholder.nickName")}
              name="nickname"
              hidden={registerForm !== 2}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                allowClear
                spellCheck={false}
                placeholder={t("toast.inputNickName")}
              />
            </Form.Item>

            <Form.Item
              label={t("placeholder.password")}
              name="password"
              rules={[
                {
                  required: true,
                  pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,20}$/,
                  message: t("toast.passwordRules"),
                },
              ]}
            >
              <Input.Password allowClear placeholder={t("toast.inputPassword")} />
            </Form.Item>

            <Form.Item
              label={t("placeholder.confirmPassword")}
              name="password2"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: t("toast.reconfirmPassword"),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t("toast.passwordsDifferent")));
                  },
                }),
              ]}
              className="mb-8"
            >
              <Input.Password allowClear placeholder={t("toast.reconfirmPassword")} />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {registerForm === 2 ? t("confirm") : t("placeholder.nextStep")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;
