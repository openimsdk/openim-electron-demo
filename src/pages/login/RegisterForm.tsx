import { LeftOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, InputRef, Select, Space } from "antd";
import { t } from "i18next";
import md5 from "md5";
import React, { useEffect, useState } from "react";

import { useRegister, useSendSms, useVerifyCode } from "@/api/login";

import { areaCode } from "./areaCode";
import type { FormType } from "./index";

type RegisterFormProps = {
  setFormType: (type: FormType) => void;
};

type FormFields = {
  phoneNumber: string;
  areaCode: string;
  verifyCode: string;
  invitationCode: string;
  nickname: string;
  password: string;
  password2: string;
};

const RegisterForm = ({ setFormType }: RegisterFormProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormFields>();
  const { mutate: sendSms } = useSendSms();
  const { mutate: verifyCode } = useVerifyCode();
  const { mutate: register } = useRegister();

  // 0login 1resetPassword 2register
  const [registerForm, setRegisterForm] = useState(0);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs: InputRef[] = [];
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
        inputRefs[index + 1].focus();
      }
    }
  };
  const handleInputKeyUp = (index: number, event: React.KeyboardEvent) => {
    const keyPressed = event.keyCode || event.which;

    if (keyPressed === 8 && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs[index - 1].focus();
    }

    if (keyPressed === 8 || keyPressed === 46) {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    }
  };

  const [mathPassword, setMathPassword] = useState(true);
  const password = Form.useWatch("password", form);
  const password2 = Form.useWatch("password2", form);
  useEffect(() => {
    if (password === password2) {
      setMathPassword(true);
    } else {
      setMathPassword(false);
    }
  }, [password, password2]);

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
      sendSms(
        {
          usedFor: 1,
          ...fields,
        },
        {
          onSuccess() {
            setCountdown(60);
            setRegisterForm(1);
          },
        },
      );
    }
    if (registerForm === 1) {
      verifyCode(
        {
          ...fields,
          usedFor: 1,
          verifyCode: code.join(""),
        },
        {
          onSuccess() {
            setRegisterForm(2);
          },
        },
      );
    }
    if (registerForm === 2) {
      register(
        {
          verifyCode: code.join(""),
          autoLogin: true,
          user: {
            nickname: fields.nickname,
            faceURL: "",
            areaCode: fields.areaCode,
            phoneNumber: fields.phoneNumber,
            password: md5(fields.password),
          },
        },
        {
          onSuccess() {
            message.success(t("toast.registerSuccess"));
            setFormType(0);
          },
        },
      );
    }
  };

  const sendSmsHandle = () => {
    sendSms(
      {
        phoneNumber: form.getFieldValue("phoneNumber") as string,
        areaCode: form.getFieldValue("areaCode") as string,
        invitationCode: form.getFieldValue("invitationCode") as string,
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

  return (
    <div className="flex flex-col justify-between">
      <div className="cursor-pointer text-sm text-gray-400" onClick={back}>
        <LeftOutlined rev={undefined} />
        <span className="ml-1">{t("placeholder.getBack")}</span>
      </div>
      <div className="mt-4 text-2xl font-medium">
        {registerForm === 0 && <span>{t("placeholder.register")}</span>}
        {registerForm === 1 && <span>{t("placeholder.verifyPhoneNumber")}</span>}
        {registerForm === 2 && <span>{t("placeholder.setInfo")}</span>}
      </div>
      <div className="mt-4 tracking-wider text-gray-400" hidden={registerForm !== 1}>
        <span>{t("placeholder.pleaseEnterSendTo")}</span>
        <span className=" text-blue-600">
          {form.getFieldValue("areaCode")} {form.getFieldValue("phoneNumber")}
        </span>
        <span>{t("placeholder.verifyValidity")}</span>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="mt-4"
        initialValues={{ areaCode: "+86" }}
      >
        <Form.Item label={t("placeholder.phoneNumber")} hidden={registerForm !== 0}>
          <Space.Compact className="w-full">
            <Form.Item name="areaCode" noStyle>
              <Select options={areaCode} className="!w-28" />
            </Form.Item>
            <Form.Item name="phoneNumber" noStyle>
              <Input allowClear placeholder={t("toast.inputCorrectPhoneNumber")} />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          className=" mb-24"
          label={t("placeholder.invitationCode")}
          name="invitationCode"
          hidden={registerForm !== 0}
        >
          <Input
            allowClear
            placeholder={`${t("toast.inputInvitationCode")}${t(
              "placeholder.optional",
            )}`}
            className="w-full"
          />
        </Form.Item>

        <Form.Item label="" hidden={registerForm !== 1} className="mb-14 mt-8">
          <div className="flex flex-row items-center justify-center">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(input: InputRef) => (inputRefs[index] = input)}
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
                <span>{t("placeholder.regain") + t("placeholder.invitationCode")}</span>
              </>
            ) : (
              <>
                <span onClick={sendSmsHandle} className="cursor-pointer text-blue-500">
                  {t("placeholder.regain")}
                </span>
                <span>{t("placeholder.invitationCode")}</span>
              </>
            )}
          </div>
        </Form.Item>

        <Form.Item
          label={t("placeholder.nickName")}
          name="nickname"
          hidden={registerForm !== 2}
        >
          <Input allowClear placeholder={t("toast.inputNickName")} />
        </Form.Item>

        <Form.Item
          label={t("placeholder.password")}
          name="password"
          help={
            <span className=" text-xs text-gray-400">{t("toast.passwordRules")}</span>
          }
          hidden={registerForm !== 2}
        >
          <Input.Password allowClear placeholder={t("toast.inputPassword")} />
        </Form.Item>

        <Form.Item
          label={t("placeholder.confirmPassword")}
          name="password2"
          validateStatus={mathPassword ? "" : "error"}
          help={mathPassword ? "" : t("toast.passwordsDifferent")}
          hidden={registerForm !== 2}
          className="mb-8"
        >
          <Input.Password allowClear placeholder={t("toast.passwordsDifferent")} />
        </Form.Item>

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
