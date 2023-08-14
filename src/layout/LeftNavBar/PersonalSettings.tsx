import { CloseOutlined, RightOutlined } from "@ant-design/icons";
import { Checkbox, Divider, Modal, Spin } from "antd";
import { forwardRef, ForwardRefRenderFunction, memo, useRef } from "react";
import { useMutation } from "react-query";

import { modal } from "@/AntdGlobalComp";
import { errorHandle } from "@/api/errorHandle";
import {
  BusinessAllowType,
  BusinessUserInfo,
  updateBusinessUserInfo,
} from "@/api/login";
import i18n from "@/i18n";
import { useMessageStore, useUserStore } from "@/store";
import { feedbackToast } from "@/utils/common";
import { MessageReceiveOptType } from "@/utils/open-im-sdk-wasm/types/enum";
import { getIMUserID } from "@/utils/storage";

import { OverlayVisibleHandle, useOverlayVisible } from "../../hooks/useOverlayVisible";
import { IMSDK } from "../MainContentWrap";
import BlackList from "./BlackList";
import ChangePassword from "./ChangePassword";

export type LocaleString = "zh-CN" | "en";

const PersonalSettings: ForwardRefRenderFunction<OverlayVisibleHandle, unknown> = (
  _,
  ref,
) => {
  const backListRef = useRef<OverlayVisibleHandle>(null);
  const changePasswordRef = useRef<OverlayVisibleHandle>(null);

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
      maskStyle={{
        opacity: 0,
        transition: "none",
      }}
      width={600}
      className="no-padding-modal max-w-[70vw]"
      maskTransitionName=""
    >
      <PersonalSettingsContent
        closeOverlay={closeOverlay}
        openBackListOverlay={() => backListRef.current?.openOverlay()}
        openChangePasswordOverlay={() => changePasswordRef.current?.openOverlay()}
      />
      <BlackList ref={backListRef} />
      <ChangePassword ref={changePasswordRef} />
    </Modal>
  );
};

export default memo(forwardRef(PersonalSettings));

export const PersonalSettingsContent = ({
  closeOverlay,
  openBackListOverlay,
  openChangePasswordOverlay,
}: {
  closeOverlay?: () => void;
  openBackListOverlay?: () => void;
  openChangePasswordOverlay?: () => void;
}) => {
  const selfInfo = useUserStore((state) => state.selfInfo);
  const localeStr = useUserStore((state) => state.appSettings.locale);
  const closeAction = useUserStore((state) => state.appSettings.closeAction);
  const updateAppSettings = useUserStore((state) => state.updateAppSettings);
  const updateSelfInfo = useUserStore((state) => state.updateSelfInfo);
  const clearHistoryMessage = useMessageStore((state) => state.clearHistoryMessage);

  const { isLoading: businessSettingUpdating, mutate: updateBusinessSetting } =
    useMutation(updateBusinessUserInfo, {
      onError: errorHandle,
    });
  const { isLoading: recvMessageOptUpdating, mutate: updateRecvMessageOpt } =
    useMutation((opt: MessageReceiveOptType) => IMSDK.setGlobalRecvMessageOpt(opt), {
      onError: errorHandle,
    });

  const localeChange = (checked: boolean, locale: LocaleString) => {
    if (!checked) return;
    console.log(checked, locale);
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

  const tryClearChatLogs = () => {
    modal.confirm({
      title: "清空聊天记录",
      content: "确认清空所有聊天记录吗？",
      onOk: async () => {
        try {
          await IMSDK.deleteAllMsgFromLocalAndSvr();
          clearHistoryMessage();
        } catch (error) {
          feedbackToast({ error });
        }
      },
    });
  };

  const toBlackList = () => {
    openBackListOverlay?.();
  };

  const toChangePassword = () => {
    openChangePasswordOverlay?.();
  };

  const businessSettingsUpdate = (vaule: boolean, key: keyof BusinessUserInfo) => {
    const updateInfo: Partial<BusinessUserInfo> = {};
    if (key === "globalRecvMsgOpt") {
      updateInfo[key] = vaule
        ? MessageReceiveOptType.NotNotify
        : MessageReceiveOptType.Nomal;
      updateRecvMessageOpt(updateInfo[key]!, {
        onSuccess: () => {
          updateSelfInfo(updateInfo);
        },
      });
      return;
    }
    if (key === "allowAddFriend") {
      updateInfo[key] = !vaule ? BusinessAllowType.Allow : BusinessAllowType.NotAllow;
    }
    const userID = useUserStore.getState().selfInfo.userID;
    updateBusinessSetting(
      { ...updateInfo, userID },
      {
        onSuccess: () => {
          updateSelfInfo(updateInfo);
        },
      },
    );
  };

  return (
    <div className="flex max-h-[80vh] flex-col bg-[var(--chat-bubble)]">
      <div className="app-drag flex items-center justify-between bg-[var(--gap-text)] p-5">
        <span className="text-base font-medium">账号设置</span>
        <CloseOutlined
          className="app-no-drag cursor-pointer text-[#8e9aaf]"
          rev={undefined}
          onClick={closeOverlay}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-6">
          <div>
            <div className="pb-5 pt-4 text-base font-medium">个人设置</div>
            <div className="pb-8 pl-1">
              <div className="pb-3 font-medium">选择语言</div>
              <div>
                <Checkbox
                  checked={localeStr === "zh-CN"}
                  className="w-36"
                  onChange={(e) => localeChange(e.target.checked, "zh-CN")}
                >
                  简体中文
                </Checkbox>
                <Checkbox
                  checked={localeStr === "en"}
                  onChange={(e) => localeChange(e.target.checked, "en")}
                >
                  English
                </Checkbox>
              </div>
            </div>
            {Boolean(window.electronAPI) && (
              <div className="pb-8 pl-1">
                <div className="pb-3 font-medium">点击关闭按钮时的事件</div>
                <div>
                  <Checkbox
                    checked={closeAction === "quit"}
                    className="w-36"
                    onChange={(e) => closeActionChange(e.target.checked, "quit")}
                  >
                    退出应用
                  </Checkbox>
                  <Checkbox
                    checked={closeAction === "miniSize"}
                    onChange={(e) => closeActionChange(e.target.checked, "miniSize")}
                  >
                    最小化托盘
                  </Checkbox>
                </div>
              </div>
            )}
            <div className="pb-8 pl-1">
              <div className="pb-3 font-medium">消息提示</div>
              <Spin spinning={businessSettingUpdating || recvMessageOptUpdating}>
                <div>
                  <Checkbox
                    checked={
                      selfInfo.globalRecvMsgOpt === MessageReceiveOptType.NotNotify
                    }
                    onChange={(e) =>
                      businessSettingsUpdate(e.target.checked, "globalRecvMsgOpt")
                    }
                  >
                    勿扰模式
                  </Checkbox>
                </div>
              </Spin>
            </div>
            <div className="pb-8 pl-1">
              <div className="pb-3 font-medium">添加好友设置</div>
              <div>
                <Spin spinning={businessSettingUpdating}>
                  <Checkbox
                    checked={selfInfo.allowAddFriend === BusinessAllowType.NotAllow}
                    onChange={(e) =>
                      businessSettingsUpdate(e.target.checked, "allowAddFriend")
                    }
                  >
                    禁止添加我为好友
                  </Checkbox>
                </Spin>
              </div>
            </div>
          </div>
        </div>
        <Divider className="m-0 border-4 border-[var(--gap-text)]" />
        <div
          className="flex cursor-pointer items-center justify-between px-6 py-4"
          onClick={toBlackList}
        >
          <div className="text-base font-medium">通信录黑名单</div>
          <RightOutlined rev={undefined} />
        </div>
        <Divider className="m-0 border-4 border-[var(--gap-text)]" />
        <div
          className="flex cursor-pointer items-center justify-between px-6 py-4"
          onClick={toChangePassword}
        >
          <div className="text-base font-medium">修改密码</div>
          <RightOutlined rev={undefined} />
        </div>
        <Divider className="m-0 border-4 border-[var(--gap-text)]" />
        <div className="cursor-pointer px-6 py-4">
          <div
            className="text-base font-medium text-[var(--warn-text)]"
            onClick={tryClearChatLogs}
          >
            清空聊天记录
          </div>
        </div>
      </div>
    </div>
  );
};
