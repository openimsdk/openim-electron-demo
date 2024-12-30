import { useLatest, useThrottleFn, useUpdateEffect } from "ahooks";
import { useEffect } from "react";

import { useCurrentMemberRole } from "@/hooks/useCurrentMemberRole";
import { IMSDK } from "@/layout/MainContentWrap";
import { useContactStore, useConversationStore, useUserStore } from "@/store";

export default function useConversationState() {
  const syncState = useUserStore((state) => state.syncState);
  const latestSyncState = useLatest(syncState);
  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );
  const latestCurrentConversation = useLatest(currentConversation);
  const isBlackUser = useContactStore(
    (state) =>
      state.blackList.findIndex(
        (user) => user.userID === currentConversation?.userID,
      ) !== -1,
  );

  const { isJoinGroup, isNomal } = useCurrentMemberRole();

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
      latestSyncState.current === "loading" ||
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
    { wait: 2000, leading: false },
  );

  const getIsCanSendMessage = () => {
    if (currentConversation?.userID) {
      return !isBlackUser;
    }

    if (!isJoinGroup) {
      return false;
    }

    return true;
  };

  return {
    getIsCanSendMessage,
    isBlackUser,
    currentConversation,
  };
}
