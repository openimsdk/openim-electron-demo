import { CloseOutlined, RightOutlined } from "@ant-design/icons";
import { CbEvents } from "@openim/wasm-client-sdk";
import { WSEvent } from "@openim/wasm-client-sdk/lib/types/entity";
import { useRequest } from "ahooks";
import { App, Button, Divider, Form, Input, Modal, Space, Spin } from "antd";
import { t } from "i18next";
import { forwardRef, ForwardRefRenderFunction, memo, useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";

import logo from "@/assets/images/profile/logo.png";
import { APP_NAME, APP_VERSION, SDK_VERSION } from "@/config";
import { feedbackToast } from "@/utils/common";

import { OverlayVisibleHandle, useOverlayVisible } from "../../hooks/useOverlayVisible";
import { IMSDK } from "../MainContentWrap";

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
  const { modal } = App.useApp();
  const [progress, setProgress] = useState(0);

  const [_, copyToClipboard] = useCopyToClipboard();

  const { loading, runAsync } = useRequest(IMSDK.uploadLogs, {
    manual: true,
  });

  const tryLogReport = async (line: number) => {
    try {
      await runAsync({ line, ex: "" });
      feedbackToast({
        msg: t("placeholder.uploadSuccess"),
      });
    } catch (error) {
      feedbackToast({
        msg: t("placeholder.uploadFailed"),
        error: error,
      });
    }
    setProgress(0);
  };

  useEffect(() => {
    const uploadHandler = ({
      data: { current, size },
    }: WSEvent<{ current: number; size: number }>) => {
      const progress = (current / size) * 100;
      console.log("OnUploadLogsProgress", Number(progress.toFixed(0)), current, size);
      setProgress(Number(progress.toFixed(0)));
    };
    IMSDK.on(CbEvents.OnUploadLogsProgress, uploadHandler);
    return () => {
      IMSDK.off(CbEvents.OnUploadLogsProgress, uploadHandler);
    };
  }, []);

  const Modal = ({ close }: { close: () => void }) => {
    const [line, setLine] = useState(100);
    return (
      <div className="flex w-[300px] flex-col p-6">
        <Input
          addonBefore="Line:"
          value={line}
          onChange={(e) => {
            setLine(Number(e.target.value));
          }}
          type="number"
        />
        <Space className="ml-auto mt-4">
          <Button onClick={() => close()}>{t("cancel")}</Button>
          <Button
            type="primary"
            onClick={() => {
              tryLogReport(line);
              close();
            }}
          >
            {t("confirm")}
          </Button>
        </Space>
      </div>
    );
  };

  const openSelectLine = () => {
    const current = modal.info({
      title: null,
      icon: null,
      footer: null,
      width: 300,
      className: "no-padding-modal",
      centered: true,
      maskTransitionName: "",
      content: <Modal close={() => current.destroy()} />,
    });
  };

  const handleCopy = () => {
    copyToClipboard(`${`${APP_NAME} ${APP_VERSION}`}/${SDK_VERSION}`);
    feedbackToast({ msg: t("toast.copySuccess") });
  };

  return (
    <Spin spinning={loading} tip={`${progress}%`}>
      <div className="bg-[var(--chat-bubble)]">
        <div className="app-drag flex items-center justify-between bg-[var(--gap-text)] p-5">
          <span className="text-base font-medium">{t("placeholder.about")}</span>
          <CloseOutlined
            className="app-no-drag cursor-pointer text-[#8e9aaf]"
            rev={undefined}
            onClick={closeOverlay}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <img className="mb-2 mt-7" width={56} src={logo} alt="" />
          <div
            className="mb-5 flex cursor-pointer flex-col items-center"
            onClick={handleCopy}
          >
            <div>{`${APP_NAME} ${APP_VERSION}`}</div>
            <div>{SDK_VERSION}</div>
          </div>
        </div>

        <Divider className="border-1 m-0 border-[var(--gap-text)]" />

        {window.electronAPI && (
          <>
            <div
              className="flex cursor-pointer items-center justify-between border-b border-[var(--gap-text)] px-3 py-2"
              onClick={() => tryLogReport(10000)}
            >
              <div>{t("placeholder.reportLog")}</div>
              <RightOutlined rev={undefined} />
            </div>
            <div
              className="flex cursor-pointer items-center justify-between border-b border-[var(--gap-text)] px-3 py-2"
              onClick={openSelectLine}
            >
              <div>{t("placeholder.reportSpecificLog")}</div>
              <RightOutlined rev={undefined} />
            </div>
          </>
        )}
      </div>
    </Spin>
  );
};
