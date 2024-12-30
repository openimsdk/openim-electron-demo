import type { SessionType } from "@openim/wasm-client-sdk";
import { ConversationItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { feedbackToast } from "@/utils/common";

export type ToSpecifiedConversationParams = {
  sourceID: string;
  sessionType: SessionType;
  isJump?: boolean;
  isChildWindow?: boolean;
};

export function useConversationToggle() {
  const navigate = useNavigate();
  const updateCurrentConversation = useConversationStore(
    (state) => state.updateCurrentConversation,
  );

  const getConversation = async ({
    sourceID,
    sessionType,
  }: {
    sourceID: string;
    sessionType: SessionType;
  }): Promise<ConversationItem | undefined> => {
    let conversation = useConversationStore
      .getState()
      .conversationList.find(
        (item) => item.userID === sourceID || item.groupID === sourceID,
      );
    if (!conversation) {
      try {
        conversation = (
          await IMSDK.getOneConversation({
            sourceID,
            sessionType,
          })
        ).data;
      } catch (error) {
        feedbackToast({ error });
      }
    }
    return conversation;
  };

  const toSpecifiedConversation = useCallback(
    async (params: ToSpecifiedConversationParams) => {
      const { sourceID, sessionType, isJump } = params;
      const conversation = await getConversation({ sourceID, sessionType });
      if (
        !conversation ||
        useConversationStore.getState().currentConversation?.conversationID ===
          conversation.conversationID
      )
        return;
      await updateCurrentConversation({ ...conversation }, isJump);
      navigate(`/chat/${conversation.conversationID}`);
    },
    [],
  );

  return {
    toSpecifiedConversation,
  };
}
