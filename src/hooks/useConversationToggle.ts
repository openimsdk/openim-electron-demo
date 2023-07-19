import { useNavigate } from "react-router-dom";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { feedbackToast } from "@/utils/common";
import { ConversationItem } from "@/utils/open-im-sdk-wasm/types/entity";
import { SessionType } from "@/utils/open-im-sdk-wasm/types/enum";

export function useConversationToggle() {
  const navigate = useNavigate();

  const conversationID = useConversationStore(
    (state) => state.currentConversation?.conversationID,
  );
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
          await IMSDK.getOneConversation<ConversationItem>({
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

  const toSpecifiedConversation = async (data: {
    sourceID: string;
    sessionType: SessionType;
  }) => {
    const conversation = await getConversation(data);
    if (!conversation || conversationID === conversation.conversationID) return;
    updateCurrentConversation({ ...conversation });
    navigate(`/chat/${conversation.conversationID}`);
  };

  return {
    toSpecifiedConversation,
  };
}
