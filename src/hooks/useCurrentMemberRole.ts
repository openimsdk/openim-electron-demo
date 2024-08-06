import { GroupMemberRole } from "@openim/wasm-client-sdk";
import { useEffect, useState } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";

export function useCurrentMemberRole() {
  const currentMemberInGroup = useConversationStore(
    (state) => state.currentMemberInGroup,
  );

  const [isJoinGroup, setIsJoinGroup] = useState(true);

  useEffect(() => {
    const groupID = currentMemberInGroup?.groupID;
    if (!groupID) {
      setIsJoinGroup(false);
      return;
    }

    async function checkGroupMembership() {
      try {
        const { data } = await IMSDK.isJoinGroup<boolean>(groupID as string);
        setIsJoinGroup(data);
      } catch (error) {
        setIsJoinGroup(false);
      }
    }

    checkGroupMembership();
  }, [currentMemberInGroup?.groupID]);

  const isOwner = currentMemberInGroup?.roleLevel === GroupMemberRole.Owner;
  const isAdmin = currentMemberInGroup?.roleLevel === GroupMemberRole.Admin;
  const isNomal = currentMemberInGroup?.roleLevel === GroupMemberRole.Normal;
  const currentRolevel = currentMemberInGroup?.roleLevel ?? 0;
  const currentIsMuted = (currentMemberInGroup?.muteEndTime ?? 0) > Date.now();

  return {
    isOwner,
    isAdmin,
    isNomal,
    isJoinGroup,
    currentRolevel,
    currentIsMuted,
    currentMemberInGroup,
  };
}
