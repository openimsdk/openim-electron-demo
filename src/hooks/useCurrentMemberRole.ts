import { GroupMemberRole } from "open-im-sdk-wasm";
import { useMemo } from "react";

import { useConversationStore } from "@/store";

export function useCurrentMemberRole() {
  const currentMemberInGroup = useConversationStore(
    (state) => state.currentMemberInGroup,
  );

  const isOwner = useMemo(
    () => currentMemberInGroup?.roleLevel === GroupMemberRole.Owner,
    [currentMemberInGroup?.groupID, currentMemberInGroup?.roleLevel],
  );
  const isAdmin = useMemo(
    () => currentMemberInGroup?.roleLevel === GroupMemberRole.Admin,
    [currentMemberInGroup?.groupID, currentMemberInGroup?.roleLevel],
  );
  const isNomal = useMemo(
    () => currentMemberInGroup?.roleLevel === GroupMemberRole.Nomal,
    [currentMemberInGroup?.groupID, currentMemberInGroup?.roleLevel],
  );
  const isJoinGroup = useMemo(
    () => Boolean(currentMemberInGroup?.groupID),
    [currentMemberInGroup?.groupID],
  );
  const currentRolevel = useMemo(
    () => currentMemberInGroup?.roleLevel ?? 0,
    [currentMemberInGroup?.groupID, currentMemberInGroup?.roleLevel],
  );

  return {
    isOwner,
    isAdmin,
    isNomal,
    isJoinGroup,
    currentRolevel,
  };
}
