import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { t } from "i18next";
import { forwardRef, ForwardRefRenderFunction, memo } from "react";
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
      centered
      onCancel={closeOverlay}
      destroyOnClose
      styles={{
        mask: {
          opacity: 0,
          transition: "none",
        },
      }}
      width={484}
      className="no-padding-modal"
      maskTransitionName=""
    >
      <div>
        <div className="flex bg-[var(--chat-bubble)] p-5">
          <span className="text-base font-medium">{t("placeholder.editInfo")}</span>
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
              label={t("placeholder.nickName")}
              name="nickname"
              rules={[{ required: true, message: t("toast.inputNickName") }]}
            >
              <Input maxLength={20} spellCheck={false} />
            </Form.Item>
            <Form.Item label={t("placeholder.gender")} name="gender">
              <Select>
                <Select.Option value={1}>{t("placeholder.man")}</Select.Option>
                <Select.Option value={2}>{t("placeholder.female")}</Select.Option>
                <Select.Option value={0}>{t("placeholder.unknown")}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={t("placeholder.phoneNumber")}
              name="phoneNumber"
              // rules={[{ pattern: /^1[3-9]\d{9}$/, message: t("placeholder.inputCorrectPhoneNumber") }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label={t("placeholder.email")}
              name="email"
              rules={[{ type: "email", message: t("toast.inputCorrectEmail") }]}
            >
              <Input spellCheck={false} placeholder={t("toast.inputEmail")} />
            </Form.Item>

            <Form.Item label={t("placeholder.birth")} name="birth">
              <DatePicker
                disabledDate={(current) => current && current > dayjs().endOf("day")}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end">
                <Button
                  className="mr-3.5 border-0 bg-[var(--chat-bubble)] px-6"
                  onClick={closeOverlay}
                >
                  {t("cancel")}
                </Button>
                <Button
                  className="px-6"
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                >
                  {t("confirm")}
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
