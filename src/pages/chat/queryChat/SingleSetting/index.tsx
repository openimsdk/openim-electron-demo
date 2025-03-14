import { RightOutlined } from "@ant-design/icons";
import { Button, Divider, Drawer } from "antd";
import { t } from "i18next";
import { forwardRef, ForwardRefRenderFunction, memo } from "react";

import { modal } from "@/AntdGlobalComp";
import OIMAvatar from "@/components/OIMAvatar";
import SettingRow from "@/components/SettingRow";
import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import { IMSDK } from "@/layout/MainContentWrap";
import { useContactStore } from "@/store/contact";
import { feedbackToast } from "@/utils/common";
import { emit } from "@/utils/events";
import { useConversationStore } from "@/store";

// export interface SingleSettingProps {}

const SingleSetting: ForwardRefRenderFunction<OverlayVisibleHandle, unknown> = (
  _,
  ref,
) => {
  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );

  const isBlack = useContactStore((state) => state.blackList).some(
    (black) => currentConversation?.userID === black.userID,
  );
  const isFriend = useContactStore((state) => state.friendList).some(
    (friend) => currentConversation?.userID === friend.userID,
  );

  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  const updateBlack = async () => {
    if (!currentConversation) return;
    const execFunc = async () => {
      try {
        isBlack
          ? await IMSDK.removeBlack(currentConversation?.userID)
          : await IMSDK.addBlack({
              toUserID: currentConversation?.userID,
            });
      } catch (error) {
        feedbackToast({ error, msg: t("toast.updateBlackStateFailed") });
      }
    };
    if (!isBlack) {
      modal.confirm({
        title: t("placeholder.moveBlacklist"),
        content: (
          <div className="flex items-baseline">
            <div>{t("toast.confirmMoveBlacklist")}</div>
            <span className="text-xs text-[var(--sub-text)]">
              {t("placeholder.willFilterThisUserMessage")}
            </span>
          </div>
        ),
        onOk: execFunc,
      });
    } else {
      await execFunc();
    }
  };

  const tryUnfriend = () => {
    if (!currentConversation) return;
    modal.confirm({
      title: t("placeholder.unfriend"),
      content: t("toast.confirmUnfriend"),
      onOk: async () => {
        try {
          await IMSDK.deleteFriend(currentConversation.userID);
        } catch (error) {
          feedbackToast({ error, msg: t("toast.unfriendFailed") });
        }
      },
    });
  };

  const openUserCard = () => {
    emit("OPEN_USER_CARD", { userID: currentConversation?.userID });
  };

  return (
    <Drawer
      title={t("placeholder.setting")}
      placement="right"
      rootClassName="chat-drawer"
      destroyOnClose
      onClose={closeOverlay}
      open={isOverlayOpen}
      maskClassName="opacity-0"
      maskMotion={{
        visible: false,
      }}
      width={450}
      getContainer={"#chat-container"}
    >
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={openUserCard}
      >
        <div className="flex items-center">
          <OIMAvatar
            src={currentConversation?.faceURL}
            text={currentConversation?.showName}
          />
          <div className="ml-3">{currentConversation?.showName}</div>
        </div>
        <RightOutlined rev={undefined} />
      </div>
      <Divider className="m-0 border-4 border-[#F4F5F7]" />
      <SettingRow
        title={t("placeholder.moveBlacklist")}
        value={isBlack}
        tryChange={updateBlack}
      />
      <Divider className="m-0 border-4 border-[#F4F5F7]" />

      <div className="flex-1" />
      {isFriend && (
        <div className="flex w-full justify-center pb-3 pt-24">
          <Button type="primary" danger onClick={tryUnfriend}>
            {t("placeholder.unfriend")}
          </Button>
        </div>
      )}
    </Drawer>
  );
};

export default memo(forwardRef(SingleSetting));
