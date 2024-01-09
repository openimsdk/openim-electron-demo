import { MessageStatus } from "open-im-sdk-wasm";
import { SendMsgParams } from "open-im-sdk-wasm/lib/types/params";
import { useCallback } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { ExMessageItem, useConversationStore, useMessageStore } from "@/store";
import emitter from "@/utils/events";

export type SendMessageParams = Partial<Omit<SendMsgParams, "message">> & {
  message: ExMessageItem;
  needPush?: boolean;
};

export function useSendMessage() {
  const pushNewMessage = useMessageStore((state) => state.pushNewMessage);
  const updateOneMessage = useMessageStore((state) => state.updateOneMessage);

  const sendMessage = useCallback(
    async ({ recvID, groupID, message, needPush }: SendMessageParams) => {
      const sourceID = recvID || groupID;
      const currentUserID = useConversationStore.getState().currentConversation?.userID;
      const currentGroupID =
        useConversationStore.getState().currentConversation?.groupID;
      const inCurrentConversation =
        currentUserID === sourceID || currentGroupID === sourceID || !sourceID;
      needPush = needPush ?? inCurrentConversation;

      if (needPush) {
        pushNewMessage(message);
        emitter.emit("CHAT_LIST_SCROLL_TO_BOTTOM", false);
      }

      const options = {
        recvID: recvID ?? currentUserID ?? "",
        groupID: groupID ?? currentGroupID ?? "",
        message,
      };

      try {
        const { data: successMessage } = await IMSDK.sendMessage(options);
        updateOneMessage(successMessage as ExMessageItem, true);
      } catch (error) {
        updateOneMessage({
          ...message,
          status: MessageStatus.Failed,
        });
      }
    },
    [],
  );

  return {
    sendMessage,
    updateOneMessage,
  };
}
