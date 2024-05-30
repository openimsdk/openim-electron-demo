import { App } from "antd";
import { t } from "i18next";
import { useCallback } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { feedbackToast } from "@/utils/common";

export function useConversationSettings() {
  const { modal } = App.useApp();

  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );

  const updateConversationPin = useCallback(
    async (isPinned: boolean) => {
      if (!currentConversation) return;

      try {
        await IMSDK.pinConversation({
          conversationID: currentConversation.conversationID,
          isPinned,
        });
      } catch (error) {
        feedbackToast({ error, msg: t("toast.pinConversationFailed") });
      }
    },
    [currentConversation?.conversationID],
  );

  const clearConversationMessages = useCallback(() => {
    if (!currentConversation) return;
    modal.confirm({
      title: t("toast.clearChatHistory"),
      content: t("toast.confirmClearChatHistory"),
      onOk: async () => {
        try {
          await IMSDK.clearConversationAndDeleteAllMsg(
            currentConversation.conversationID,
          );
        } catch (error) {
          feedbackToast({ error, msg: t("toast.clearConversationMessagesFailed") });
        }
      },
    });
  }, [currentConversation?.conversationID]);

  return {
    currentConversation,
    updateConversationPin,
    clearConversationMessages,
  };
}
