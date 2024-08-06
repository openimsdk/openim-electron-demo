import { MessageItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { useLatest, useRequest } from "ahooks";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { IMSDK } from "@/layout/MainContentWrap";
import emitter from "@/utils/events";

const START_INDEX = 10000;
const SPLIT_COUNT = 20;

export function useHistoryMessageList() {
  const { conversationID } = useParams();
  const [loadState, setLoadState] = useState({
    initLoading: true,
    hasMore: true,
    messageList: [] as MessageItem[],
    firstItemIndex: START_INDEX,
  });
  const latestLoadState = useLatest(loadState);
  const minSeq = useRef(0);

  useEffect(() => {
    getMoreMessages(false);
    return () => {
      cancelLoadMore();
      setLoadState(() => ({
        initLoading: true,
        hasMore: true,
        messageList: [] as MessageItem[],
        firstItemIndex: START_INDEX,
      }));
      minSeq.current = 0;
    };
  }, [conversationID]);

  useEffect(() => {
    const pushNewMessage = (message: MessageItem) => {
      setLoadState((preState) => ({
        ...preState,
        messageList: [...preState.messageList, message],
      }));
    };
    const updateOneMessage = (message: MessageItem) => {
      setLoadState((preState) => {
        const tmpList = [...preState.messageList];
        const idx = tmpList.findIndex((msg) => msg.clientMsgID === message.clientMsgID);
        if (idx !== -1) {
          tmpList[idx] = { ...tmpList[idx], ...message };
        }
        return {
          ...preState,
          messageList: tmpList,
        };
      });
    };
    const deleteOnewMessage = (clientMsgID: string) => {
      setLoadState((preState) => {
        const tmpList = [...preState.messageList];
        const idx = tmpList.findIndex((msg) => msg.clientMsgID === clientMsgID);
        if (idx < 0) {
          return preState;
        }
        tmpList.splice(idx, 1);
        return {
          ...preState,
          messageList: tmpList,
        };
      });
    };
    const clearMessages = () => {
      setLoadState(() => ({
        initLoading: false,
        hasMore: true,
        messageList: [] as MessageItem[],
        firstItemIndex: START_INDEX,
      }));
      minSeq.current = 0;
    };
    const loadHistoryMessages = () => getMoreMessages(false);
    emitter.on("PUSH_NEW_MSG", pushNewMessage);
    emitter.on("UPDATE_ONE_MSG", updateOneMessage);
    emitter.on("DELETE_ONE_MSG", deleteOnewMessage);
    emitter.on("CLEAR_MSGS", clearMessages);
    emitter.on("LOAD_HISTORY_MSGS", loadHistoryMessages);
    return () => {
      emitter.off("PUSH_NEW_MSG", pushNewMessage);
      emitter.off("UPDATE_ONE_MSG", updateOneMessage);
      emitter.off("DELETE_ONE_MSG", deleteOnewMessage);
      emitter.off("CLEAR_MSGS", clearMessages);
      emitter.off("LOAD_HISTORY_MSGS", loadHistoryMessages);
    };
  }, []);

  const {
    loading,
    runAsync: getMoreMessages,
    cancel: cancelLoadMore,
  } = useRequest(
    async (loadMore = true) => {
      const { data } = await IMSDK.getAdvancedHistoryMessageList({
        lastMinSeq: minSeq.current,
        count: SPLIT_COUNT,
        startClientMsgID: loadMore
          ? latestLoadState.current.messageList[0]?.clientMsgID
          : "",
        conversationID: conversationID ?? "",
      });
      setLoadState((preState) => ({
        initLoading: false,
        hasMore: data.messageList.length !== 0,
        messageList: [...data.messageList, ...(loadMore ? preState.messageList : [])],
        firstItemIndex: preState.firstItemIndex - data.messageList.length,
      }));
      minSeq.current = data.lastMinSeq;
    },
    {
      manual: true,
    },
  );

  return {
    SPLIT_COUNT,
    loadState,
    latestLoadState,
    conversationID,
    loading,
    getMoreMessages,
  };
}

export const pushNewMessage = (message: MessageItem) =>
  emitter.emit("PUSH_NEW_MSG", message);
export const updateOneMessage = (message: MessageItem) =>
  emitter.emit("UPDATE_ONE_MSG", message);
export const deleteOneMessage = (clientMsgID: string) =>
  emitter.emit("DELETE_ONE_MSG", clientMsgID);
export const clearMessages = () => emitter.emit("CLEAR_MSGS");
export const loadHistoryMessages = () => emitter.emit("LOAD_HISTORY_MSGS");
