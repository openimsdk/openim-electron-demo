import { CbEvents } from "@openim/wasm-client-sdk";
import { GroupMemberItem, WSEvent } from "@openim/wasm-client-sdk/lib/types/entity";
import { useLatest } from "ahooks";
import { useCallback, useEffect, useRef, useState } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { feedbackToast } from "@/utils/common";

export const REACH_SEARCH_FLAG = "LAST_FLAG";

export interface FetchStateType {
  offset: number;
  count: number;
  loading: boolean;
  hasMore: boolean;
  groupMemberList: GroupMemberItem[];
}

interface UseGroupMembersProps {
  groupID?: string;
  notRefresh?: boolean;
}

export default function useGroupMembers(props?: UseGroupMembersProps) {
  const { groupID, notRefresh } = props ?? {};
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
          count: 20,
          filter: 0,
        });
        setFetchState((state) => ({
          ...state,
          groupMemberList: [...(refresh ? [] : state.groupMemberList), ...data],
          hasMore: data.length === state.count,
          offset: state.offset + 20,
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
