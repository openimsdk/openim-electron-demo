import { useLatest, useThrottleFn, useUpdateEffect } from "ahooks";
import { useEffect } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore, useUserStore } from "@/store";

export default function useConversationState() {
  const syncState = useUserStore((state) => state.syncState);
  const latestSyncState = useLatest(syncState);
  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );
  const latestCurrentConversation = useLatest(currentConversation);

  useUpdateEffect(() => {
    if (syncState !== "loading") {
      checkConversationState();
    }
  }, [syncState]);

  useUpdateEffect(() => {
    throttleCheckConversationState();
  }, [currentConversation?.unreadCount]);

  useEffect(() => {
    checkConversationState();
  }, [currentConversation?.conversationID]);

  const checkConversationState = () => {
    if (
      !latestCurrentConversation.current ||
      latestSyncState.current === "loading"
    )
      return;

    if (latestCurrentConversation.current.unreadCount > 0) {
      IMSDK.markConversationMessageAsRead(
        latestCurrentConversation.current.conversationID,
      );
    }
  };

  const { run: throttleCheckConversationState } = useThrottleFn(
    checkConversationState,
    { wait: 2000, leading: false },
  );

  return {
    currentConversation,
  };
}
