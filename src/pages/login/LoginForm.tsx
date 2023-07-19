import { Button, Form, Input, QRCode, Select, Space } from "antd";
import md5 from "md5";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLogin } from "@/api/login";
import login_pc from "@/assets/images/login/login_pc.png";
import login_qr from "@/assets/images/login/login_qr.png";
import { setIMProfile } from "@/utils/storage";

import { areaCode } from "./areaCode";
import type { FormType } from "./index";

type LoginType = 0 | 1 | 2;

type LoginFormProps = {
  setFormType: (type: FormType) => void;
};

const LoginForm = ({ setFormType }: LoginFormProps) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loginType, setLoginType] = useState<LoginType>(0);
  const { mutate: login, isLoading: loginLoading } = useLogin();

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

  const onFinish = (params: API.Login.LoginParams) => {
    if (loginType === 0) {
      params.password = md5(params.password ?? "");
    }
    login(params, {
      onSuccess: (data) => {
        const { chatToken, imToken, userID } = data.data;
        setIMProfile({ chatToken, imToken, userID });
        navigate("/chat");
      },
    });
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="text-xl font-medium">欢迎使用OpenIM</div>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="mt-6"
        initialValues={{
          areaCode: "+86",
          phoneNumber: "",
          password: "",
        }}
      >
        <Form.Item label="手机号">
          <Space.Compact className="w-full">
            <Form.Item name="areaCode" noStyle>
              <Select options={areaCode} className="!w-28" />
            </Form.Item>
            <Form.Item name="phoneNumber" noStyle>
              <Input allowClear placeholder="请输入您的手机号" />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        {loginType === 0 && (
          <Form.Item label="密码" name="password">
            <Input.Password allowClear placeholder="请输入您的密码" />
          </Form.Item>
        )}

        <Form.Item className="mt-12">
          <Button type="primary" htmlType="submit" block loading={loginLoading}>
            登录
          </Button>
        </Form.Item>

        <div className="flex flex-row items-center justify-center">
          <span className="text-sm text-gray-400">还没有账号？</span>
          <span
            className="cursor-pointer text-sm text-blue-500"
            onClick={() => setFormType(2)}
          >
            立即注册
          </span>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
