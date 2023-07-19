import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { forwardRef, ForwardRefRenderFunction, memo, useState } from "react";
import { useMutation } from "react-query";

import { errorHandle } from "@/api/errorHandle";
import { BusinessUserInfo, updateBusinessUserInfo } from "@/api/login";
import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import { useUserStore } from "@/store";

const EditSelfInfo: ForwardRefRenderFunction<
  OverlayVisibleHandle,
  { refreshSelfInfo: () => void }
> = ({ refreshSelfInfo }, ref) => {
  const [form] = Form.useForm();
  const selfInfo = useUserStore((state) => state.selfInfo);
  const updateSelfInfo = useUserStore((state) => state.updateSelfInfo);

  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  const { isLoading, mutate } = useMutation(updateBusinessUserInfo, {
    onError: errorHandle,
  });

  const onFinish = (value: BusinessUserInfo & { birth: Dayjs }) => {
    const options = {
      nickname: value.nickname,
      email: value.email,
      gender: value.gender,
      birth: value.birth.unix() * 1000,
    };
    mutate(options, {
      onSuccess: () => {
        updateSelfInfo(options);
        refreshSelfInfo();
        closeOverlay();
      },
    });
  };

  return (
    <Modal
      title={null}
      footer={null}
      closable={false}
      open={isOverlayOpen}
      onCancel={closeOverlay}
      destroyOnClose
      maskStyle={{
        opacity: 0,
        transition: "none",
      }}
      width={484}
      className="no-padding-modal"
      maskTransitionName=""
    >
      <div>
        <div className="flex bg-[var(--chat-bubble)] p-5">
          <span className="text-base font-medium">编辑资料</span>
        </div>
        {isOverlayOpen && (
          <Form
            form={form}
            colon={false}
            requiredMark={false}
            labelCol={{ span: 3 }}
            onFinish={onFinish}
            className="sub-label-form p-6.5"
            autoComplete="off"
            initialValues={{ ...selfInfo, birth: dayjs(selfInfo.birth) }}
          >
            <Form.Item
              label="昵称"
              name="nickname"
              rules={[{ required: true, max: 20, message: "请输入昵称！" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="性别" name="gender">
              <Select>
                <Select.Option value={1}>男</Select.Option>
                <Select.Option value={2}>女</Select.Option>
                <Select.Option value={0}>未知</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="生日" name="birth">
              <DatePicker
                disabledDate={(current) => current && current > dayjs().endOf("day")}
              />
            </Form.Item>
            <Form.Item
              label="手机号"
              name="phoneNumber"
              // rules={[{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确手机号！" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ type: "email", message: "请输入正确邮箱！" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end">
                <Button
                  className="mr-3.5 border-0 bg-[var(--chat-bubble)] px-6"
                  onClick={closeOverlay}
                >
                  取消
                </Button>
                <Button
                  className="px-6"
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                >
                  完成
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default memo(forwardRef(EditSelfInfo));
