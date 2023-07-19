import { useThrottleFn } from "ahooks";
import { useEffect } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";

export default function useConversationState() {
  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );

  const inGroup = useConversationStore((state) =>
    Boolean(state.currentMemberInGroup?.groupID),
  );

  useEffect(() => {
    checkConversationState();
    return () => {
      checkConversationState();
    };
  }, [
    currentConversation?.conversationID,
    currentConversation?.groupAtType,
    currentConversation?.unreadCount,
  ]);

  const { run: checkConversationState } = useThrottleFn(
    () => {
      if (!currentConversation) return;

      if (currentConversation.unreadCount > 0) {
        IMSDK.markConversationMessageAsRead(currentConversation.conversationID);
      }
    },
    { wait: 2000 },
  );
}
