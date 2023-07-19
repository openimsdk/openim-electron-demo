import { t } from "i18next";
import { useCallback } from "react";

import { modal } from "@/AntdGlobalComp";
import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { feedbackToast } from "@/utils/common";
import { GroupBaseInfo } from "@/utils/open-im-sdk-wasm/types/params";

export type PermissionMethods = "setGroupLookMemberInfo" | "setGroupApplyMemberFriend";

export function useGroupSettings({ closeOverlay }: { closeOverlay: () => void }) {
  const currentGroupInfo = useConversationStore((state) => state.currentGroupInfo);

  const updateGroupInfo = useCallback(
    async (value: Omit<GroupBaseInfo, "groupID">) => {
      if (!currentGroupInfo) return;
      try {
        await IMSDK.setGroupInfo({
          ...value,
          groupID: currentGroupInfo.groupID,
        });
      } catch (error) {
        feedbackToast({ error, msg: t("toast.updateGroupInfoFailed") });
      }
    },
    [currentGroupInfo?.groupID],
  );

  const tryDismissGroup = () => {
    if (!currentGroupInfo) return;

    modal.confirm({
      title: "解散群组",
      content: (
        <div className="flex items-baseline">
          <div>确认解散该群组吗？</div>
          <span className="text-xs text-[var(--sub-text)]">
            解除后将移除所有群成员。
          </span>
        </div>
      ),
      onOk: async () => {
        try {
          await IMSDK.dismissGroup(currentGroupInfo.groupID);
          closeOverlay();
        } catch (error) {
          feedbackToast({ error });
        }
      },
    });
  };

  const tryQuitGroup = () => {
    if (!currentGroupInfo) return;

    modal.confirm({
      title: "退出群组",
      content: (
        <div className="flex items-baseline">
          <div>确认退出该群组吗？</div>
          <span className="text-xs text-[var(--sub-text)]">
            退出后你将不再接收该群组消息。
          </span>
        </div>
      ),
      onOk: async () => {
        try {
          await IMSDK.quitGroup(currentGroupInfo.groupID);
          closeOverlay();
        } catch (error) {
          feedbackToast({ error });
        }
      },
    });
  };

  return {
    currentGroupInfo,
    updateGroupInfo,
    tryQuitGroup,
    tryDismissGroup,
  };
}
