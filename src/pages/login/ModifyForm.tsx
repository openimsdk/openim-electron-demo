import { LeftOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Select, Space } from "antd";
import md5 from "md5";
import { useEffect, useState } from "react";

import { useReset, useSendSms, useVerifyCode } from "@/api/login";

import { areaCode } from "./areaCode";
import type { FormType } from "./index";

type ModifyFormProps = {
  setFormType: (type: FormType) => void;
};

type FormFields = {
  phoneNumber: string;
  areaCode: string;
  verifyCode: string;
  password: string;
  password2: string;
};

const ModifyForm = ({ setFormType }: ModifyFormProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormFields>();
  const [countdown, setCountdown] = useState(0);
  const [isConfirm, setIsConfirm] = useState(false);
  const { mutate: sendSms } = useSendSms();
  const { mutate: reset } = useReset();
  const { mutate: verifyCode } = useVerifyCode();

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

  const onFinish = (fields: FormFields) => {
    if (!fields.verifyCode) return;
    if (!isConfirm) {
      verifyCode(
        {
          ...fields,
          usedFor: 2,
        },
        {
          onSuccess() {
            setIsConfirm(true);
          },
        },
      );
    } else {
      reset(
        { ...fields, password: md5(fields.password) },
        {
          onSuccess() {
            message.success("修改密码成功，请重新登录");
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
        usedFor: 3,
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
        <span className="ml-1">返回</span>
      </div>
      <div className="mt-6 text-2xl font-medium">忘记密码</div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="mt-6"
        initialValues={{ areaCode: "+86" }}
      >
        <Form.Item label="手机号" hidden={isConfirm}>
          <Space.Compact className="w-full">
            <Form.Item name="areaCode" noStyle>
              <Select options={areaCode} className="!w-28" />
            </Form.Item>
            <Form.Item name="phoneNumber" noStyle>
              <Input allowClear placeholder="请输入您的手机号" />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item label="验证码" name="verifyCode" hidden={isConfirm}>
          <Space.Compact className="w-full">
            <Input allowClear placeholder="请输入您的验证码" className="w-full" />
            <Button type="primary" onClick={sendSmsHandle} loading={countdown > 0}>
              {countdown > 0 ? `${countdown}秒` : "发送验证码"}
            </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          help={
            <span className=" text-xs text-gray-400">
              包含6～20位数字、大小写字母、特殊字符组合
            </span>
          }
          hidden={!isConfirm}
        >
          <Input.Password allowClear placeholder="请输入您的密码" />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="password2"
          validateStatus={mathPassword ? "" : "error"}
          help={mathPassword ? "" : "两次输入的密码不一致!"}
          hidden={!isConfirm}
        >
          <Input.Password allowClear placeholder="请再次确认您的密码" />
        </Form.Item>

        <Form.Item className="mt-20">
          <Button type="primary" htmlType="submit" block>
            {isConfirm ? "确认修改" : "下一步"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ModifyForm;
