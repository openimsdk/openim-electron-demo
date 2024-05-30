import { CloseOutlined } from "@ant-design/icons";
import { Form, Modal } from "antd";
import { t } from "i18next";
import { forwardRef, ForwardRefRenderFunction, memo } from "react";

import logo from "@/assets/images/profile/logo.png";

import { OverlayVisibleHandle, useOverlayVisible } from "../../hooks/useOverlayVisible";

const About: ForwardRefRenderFunction<OverlayVisibleHandle, unknown> = (_, ref) => {
  const [form] = Form.useForm();

  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  return (
    <Modal
      title={null}
      footer={null}
      closable={false}
      open={isOverlayOpen}
      centered
      onCancel={closeOverlay}
      afterClose={() => form.resetFields()}
      styles={{
        mask: {
          opacity: 0,
          transition: "none",
        },
      }}
      width={360}
      className="no-padding-modal"
      maskTransitionName=""
    >
      <AboutContent closeOverlay={closeOverlay} />
    </Modal>
  );
};

export default memo(forwardRef(About));

export const AboutContent = ({ closeOverlay }: { closeOverlay?: () => void }) => {
  return (
    <div className="bg-[var(--chat-bubble)]">
      <div className="flex items-center justify-between bg-[var(--gap-text)] p-5">
        <span className="text-base font-medium">{t("placeholder.about")}</span>
        <CloseOutlined
          className="app-no-drag cursor-pointer text-[#8e9aaf]"
          rev={undefined}
          onClick={closeOverlay}
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <img className="mb-2 mt-7" width={56} src={logo} alt="" />
        <div className="mb-5 flex flex-col items-center">
          <div>OpenIM Electron Demo</div>
        </div>
      </div>
    </div>
  );
};
