import { CloseOutlined, RightOutlined } from "@ant-design/icons";
import { Checkbox, Divider, Modal } from "antd";
import { t } from "i18next";
import { forwardRef, ForwardRefRenderFunction, memo, useRef } from "react";

import { modal } from "@/AntdGlobalComp";
import i18n from "@/i18n";
import { useUserStore } from "@/store";
import { LocaleString } from "@/store/type";
import { feedbackToast } from "@/utils/common";

import { OverlayVisibleHandle, useOverlayVisible } from "../../hooks/useOverlayVisible";
import { IMSDK } from "../MainContentWrap";
import BlackList from "./BlackList";

const PersonalSettings: ForwardRefRenderFunction<OverlayVisibleHandle, unknown> = (
  _,
  ref,
) => {
  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  return (
    <Modal
      title={null}
      footer={null}
      closable={false}
      open={isOverlayOpen}
      onCancel={closeOverlay}
      centered
      destroyOnClose
      styles={{
        mask: {
          opacity: 0,
          transition: "none",
        },
      }}
      width={360}
      className="no-padding-modal max-w-[70vw]"
      maskTransitionName=""
    >
      <PersonalSettingsContent closeOverlay={closeOverlay} />
    </Modal>
  );
};

export default memo(forwardRef(PersonalSettings));

export const PersonalSettingsContent = ({
  closeOverlay,
}: {
  closeOverlay?: () => void;
}) => {
  const localeStr = useUserStore((state) => state.appSettings.locale);
  const closeAction = useUserStore((state) => state.appSettings.closeAction);
  const updateAppSettings = useUserStore((state) => state.updateAppSettings);

  const backListRef = useRef<OverlayVisibleHandle>(null);

  const localeChange = (checked: boolean, locale: LocaleString) => {
    if (!checked) return;
    window.electronAPI?.ipcInvoke("changeLanguage", locale);
    i18n.changeLanguage(locale);
    updateAppSettings({
      locale,
    });
  };

  const closeActionChange = (checked: boolean, action: "miniSize" | "quit") => {
    if (checked) {
      window.electronAPI?.ipcInvoke("setKeyStore", {
        key: "closeAction",
        data: action,
      });
      updateAppSettings({
        closeAction: action,
      });
    }
  };

  const toBlackList = () => {
    backListRef.current?.openOverlay();
  };

  return (
    <div className="flex flex-col bg-[var(--chat-bubble)]">
      <BlackList ref={backListRef} />
      <div className="app-drag flex items-center justify-between bg-[var(--gap-text)] p-5">
        <span className="text-base font-medium">{t("placeholder.accountSetting")}</span>
        <CloseOutlined
          className="app-no-drag cursor-pointer text-[#8e9aaf]"
          rev={undefined}
          onClick={closeOverlay}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-6">
          <div>
            <div className="pb-5 pt-4 text-base font-medium">
              {t("placeholder.personalSetting")}
            </div>
            <div className="pb-8 pl-1">
              <div className="pb-3 font-medium">{t("placeholder.chooseLanguage")}</div>
              <div>
                <Checkbox
                  checked={localeStr === "zh-CN"}
                  className="mr-4"
                  onChange={(e) => localeChange(e.target.checked, "zh-CN")}
                >
                  简体中文
                </Checkbox>
                <Checkbox
                  checked={localeStr === "en-US"}
                  onChange={(e) => localeChange(e.target.checked, "en-US")}
                >
                  English
                </Checkbox>
              </div>
            </div>
            {Boolean(window.electronAPI) && (
              <div className="pb-8 pl-1">
                <div className="pb-3 font-medium">
                  {t("placeholder.closeButtonEvent")}
                </div>
                <div>
                  <Checkbox
                    checked={closeAction === "quit"}
                    className="mr-4"
                    onChange={(e) => closeActionChange(e.target.checked, "quit")}
                  >
                    {t("placeholder.exitApplication")}
                  </Checkbox>
                  <Checkbox
                    checked={closeAction === "miniSize"}
                    onChange={(e) => closeActionChange(e.target.checked, "miniSize")}
                  >
                    {t("placeholder.minimize")}
                  </Checkbox>
                </div>
              </div>
            )}
          </div>
        </div>
        <Divider className="m-0 border-4 border-[var(--gap-text)]" />
        <div
          className="flex cursor-pointer items-center justify-between px-6 py-4"
          onClick={toBlackList}
        >
          <div className="text-base font-medium">{t("placeholder.blackList")}</div>
          <RightOutlined rev={undefined} />
        </div>
        <Divider className="m-0 border-4 border-[var(--gap-text)]" />
      </div>
    </div>
  );
};
