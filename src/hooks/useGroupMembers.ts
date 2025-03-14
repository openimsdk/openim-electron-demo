import {
  GroupMemberItem,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { useLatest } from "ahooks";
import { useCallback, useState } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { feedbackToast } from "@/utils/common";
export interface FetchStateType {
  offset: number;
  count: number;
  loading: boolean;
  hasMore: boolean;
  groupMemberList: GroupMemberItem[];
}

interface UseGroupMembersProps {
  groupID?: string;
}

export default function useGroupMembers(props?: UseGroupMembersProps) {
  const { groupID } = props ?? {};
  const [fetchState, setFetchState] = useState<FetchStateType>({
    offset: 0,
    count: 20,
    loading: false,
    hasMore: true,
    groupMemberList: [],
  });
  const latestFetchState = useLatest(fetchState);

  const getMemberData = useCallback(
    async (refresh = false) => {
      const sourceID =
        groupID ?? useConversationStore.getState().currentConversation?.groupID ?? "";
      if (!sourceID) return;

      if (
        (latestFetchState.current.loading || !latestFetchState.current.hasMore) &&
        !refresh
      )
        return;

      setFetchState((state) => ({
        ...state,
        loading: true,
      }));
      try {
        const { data } = await IMSDK.getGroupMemberList({
          groupID: sourceID,
          offset: refresh ? 0 : latestFetchState.current.offset,
          count: refresh ? 500 : 100,
          filter: 0,
        });
        setFetchState((state) => ({
          ...state,
          groupMemberList: [...(refresh ? [] : state.groupMemberList), ...data],
          hasMore: data.length === (refresh ? 500 : 100),
          offset: state.offset + (refresh ? 500 : 100),
          loading: false,
        }));
      } catch (error) {
        feedbackToast({
          msg: "getMemberFailed",
          error,
        });
        setFetchState((state) => ({
          ...state,
          loading: false,
        }));
      }
    },
    [groupID],
  );

  const resetState = () => {
    setFetchState({
      offset: 0,
      count: 20,
      loading: false,
      hasMore: true,
      groupMemberList: [],
    });
  };

  return {
    fetchState,
    getMemberData,
    resetState,
  };
}
