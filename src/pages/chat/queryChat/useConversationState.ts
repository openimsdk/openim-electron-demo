import { useLatest, useUpdateEffect } from "ahooks";
import { useCallback, useEffect, useRef } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore, useUserStore } from "@/store";

export default function useConversationState() {
  const syncState = useUserStore((state) => state.syncState);
  const latestSyncState = useLatest(syncState);
  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );
  const latestCurrentConversation = useLatest(currentConversation);
  const throttleTimer = useRef<ReturnType<typeof setTimeout>>();

  const checkConversationState = useCallback(() => {
    const conversation = latestCurrentConversation.current;
    if (!conversation || latestSyncState.current === "loading") return;

    if (conversation.unreadCount > 0) {
      void IMSDK.markConversationMessageAsRead(conversation.conversationID);
    }
  }, [latestCurrentConversation, latestSyncState]);

  const throttleCheckConversationState = useCallback(() => {
    clearTimeout(throttleTimer.current);
    throttleTimer.current = setTimeout(checkConversationState, 2000);
  }, [checkConversationState]);

  useUpdateEffect(() => {
    if (syncState !== "loading") {
      checkConversationState();
    }
  }, [checkConversationState, syncState]);

  useUpdateEffect(() => {
    throttleCheckConversationState();
  }, [currentConversation?.unreadCount, throttleCheckConversationState]);

  useEffect(() => {
    checkConversationState();
  }, [checkConversationState, currentConversation?.conversationID]);

  useEffect(
    () => () => {
      clearTimeout(throttleTimer.current);
    },
    [],
  );

  return {
    currentConversation,
  };
}
