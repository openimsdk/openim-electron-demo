import { GroupMemberRole } from "@openim/wasm-client-sdk";

import { useConversationStore } from "@/store";

export function useCurrentMemberRole() {
  const currentMemberInGroup = useConversationStore(
    (state) => state.currentMemberInGroup,
  );

  const isOwner = currentMemberInGroup?.roleLevel === GroupMemberRole.Owner;
  const isAdmin = currentMemberInGroup?.roleLevel === GroupMemberRole.Admin;
  const isNomal = currentMemberInGroup?.roleLevel === GroupMemberRole.Normal;
  const currentRolevel = currentMemberInGroup?.roleLevel ?? 0;
  const currentIsMuted = (currentMemberInGroup?.muteEndTime ?? 0) > Date.now();

  return {
    isOwner,
    isAdmin,
    isNomal,
    isJoinGroup: Boolean(currentMemberInGroup?.userID),
    currentRolevel,
    currentIsMuted,
    currentMemberInGroup,
  };
}
