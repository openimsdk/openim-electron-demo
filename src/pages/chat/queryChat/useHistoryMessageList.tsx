import { MessageItem, MessageViewType } from "@openim/wasm-client-sdk";
import { useLatest, useRequest } from "ahooks";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { IMSDK } from "@/layout/MainContentWrap";
import emitter, { emit } from "@/utils/events";

const START_INDEX = 10000;
const SPLIT_COUNT = 20;
const INITIAL_LOAD_STATE = {
  initLoading: true,
  hasMoreOld: true,
  messageList: [] as MessageItem[],
  firstItemIndex: START_INDEX,
};

export function useHistoryMessageList() {
  const { conversationID } = useParams();
  const [loadState, setLoadState] = useState(INITIAL_LOAD_STATE);
  const latestLoadState = useLatest(loadState);
  const latestConversationID = useLatest(conversationID);

  const { loading: moreOldLoading, runAsync: getMoreOldMessages } = useRequest(
    async (loadMore = true) => {
      const reqConversationID = conversationID;
      const { data } = await IMSDK.getAdvancedHistoryMessageList({
        count: SPLIT_COUNT,
        startClientMsgID: loadMore
          ? latestLoadState.current.messageList[0]?.clientMsgID
          : "",
        conversationID: conversationID ?? "",
        viewType: MessageViewType.History,
      });
      if (latestConversationID.current !== reqConversationID) return;
      setLoadState((preState) => ({
        ...preState,
        initLoading: false,
        hasMoreOld: !data.isEnd,
        messageList: [...data.messageList, ...(loadMore ? preState.messageList : [])],
        firstItemIndex: preState.firstItemIndex - data.messageList.length,
      }));
    },
    { manual: true },
  );

  const loadHistoryMessages = useCallback(() => {
    setLoadState(INITIAL_LOAD_STATE);
    void getMoreOldMessages(false);
  }, [getMoreOldMessages]);

  useEffect(() => {
    loadHistoryMessages();
  }, [conversationID, loadHistoryMessages]);

  useEffect(() => {
    const pushNewMessage = (message: MessageItem) => {
      if (
        latestLoadState.current.messageList.find(
          (item) => item.clientMsgID === message.clientMsgID,
        )
      ) {
        return;
      }
      setLoadState((preState) => ({
        ...preState,
        messageList: [...preState.messageList, message],
      }));
    };
    const updateOneMessage = (message: MessageItem) => {
      setLoadState((preState) => {
        const tmpList = [...preState.messageList];
        const idx = tmpList.findIndex((msg) => msg.clientMsgID === message.clientMsgID);
        if (idx < 0) {
          return preState;
        }

        tmpList[idx] = { ...tmpList[idx], ...message };
        return {
          ...preState,
          messageList: tmpList,
        };
      });
    };
    emitter.on("PUSH_NEW_MSG", pushNewMessage);
    emitter.on("UPDATE_ONE_MSG", updateOneMessage);
    return () => {
      emitter.off("PUSH_NEW_MSG", pushNewMessage);
      emitter.off("UPDATE_ONE_MSG", updateOneMessage);
    };
  }, [latestLoadState]);

  return {
    SPLIT_COUNT,
    loadState,
    latestLoadState,
    conversationID,
    moreOldLoading,
    getMoreOldMessages,
  };
}

export const pushNewMessage = (message: MessageItem) => emit("PUSH_NEW_MSG", message);
export const updateOneMessage = (message: MessageItem) =>
  emit("UPDATE_ONE_MSG", message);
