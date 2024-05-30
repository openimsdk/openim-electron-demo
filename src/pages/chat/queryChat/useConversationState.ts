import { useLatest, useThrottleFn, useUpdateEffect } from "ahooks";
import { useEffect } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore, useUserStore } from "@/store";

export default function useConversationState() {
  const syncing = useUserStore((state) => state.syncing);
  const latestSyncing = useLatest(syncing);
  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );
  const latestCurrentConversation = useLatest(currentConversation);

  useUpdateEffect(() => {
    if (syncing !== "loading") {
      checkConversationState();
    }
  }, [syncing]);

  useUpdateEffect(() => {
    throttleCheckConversationState();
  }, [currentConversation?.groupAtType, currentConversation?.unreadCount]);

  useEffect(() => {
    checkConversationState();
  }, [currentConversation?.conversationID]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        checkConversationState();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const checkConversationState = () => {
    if (
      !latestCurrentConversation.current ||
      latestSyncing.current === "loading" ||
      document.visibilityState === "hidden"
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
    { wait: 2000 },
  );
}
