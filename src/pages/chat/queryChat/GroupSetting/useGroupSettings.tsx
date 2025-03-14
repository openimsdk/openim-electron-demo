import { GroupItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { t } from "i18next";
import { useCallback, useRef } from "react";

import { modal } from "@/AntdGlobalComp";
import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { feedbackToast } from "@/utils/common";

export type PermissionField = "applyMemberFriend" | "lookMemberInfo";

export function useGroupSettings({ closeOverlay }: { closeOverlay: () => void }) {
  const currentGroupInfo = useConversationStore((state) => state.currentGroupInfo);

  const modalRef = useRef<{
    destroy: () => void;
  } | null>(null);

  const updateGroupInfo = useCallback(
    async (value: Partial<GroupItem>) => {
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
    if (!currentGroupInfo || modalRef.current) return;

    modalRef.current = modal.confirm({
      title: t("placeholder.disbandGroup"),
      content: (
        <div className="flex items-baseline">
          <div>{t("toast.confirmDisbandGroup")}</div>
          <span className="text-xs text-[var(--sub-text)]">
            {t("placeholder.disbandGroupToast")}
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
        modalRef.current = null;
      },
      onCancel: () => {
        modalRef.current = null;
      },
    });
  };

  const tryQuitGroup = () => {
    if (!currentGroupInfo || modalRef.current) return;

    modalRef.current = modal.confirm({
      title: t("placeholder.exitGroup"),
      content: (
        <div className="flex items-baseline">
          <div>{t("toast.confirmExitGroup")}</div>
          <span className="text-xs text-[var(--sub-text)]">
            {t("placeholder.exitGroupToast")}
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
        modalRef.current = null;
      },
      onCancel: () => {
        modalRef.current = null;
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
