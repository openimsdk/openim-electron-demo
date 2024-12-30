import { MessageItem } from "@openim/wasm-client-sdk";
import { useLatest, useRequest } from "ahooks";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { IMSDK } from "@/layout/MainContentWrap";
import emitter, { emit, UpdateMessaggeBaseInfoParams } from "@/utils/events";

const START_INDEX = 10000;
const SPLIT_COUNT = 20;

export function useHistoryMessageList() {
  const { conversationID } = useParams();
  const [loadState, setLoadState] = useState({
    initLoading: true,
    hasMoreOld: true,
    messageList: [] as MessageItem[],
    firstItemIndex: START_INDEX,
  });
  const latestLoadState = useLatest(loadState);
  const minSeq = useRef(0);

  useEffect(() => {
    loadHistoryMessages();
    return () => {
      setLoadState(() => ({
        initLoading: true,
        hasMoreOld: true,
        messageList: [] as MessageItem[],
        firstItemIndex: START_INDEX,
      }));
      minSeq.current = 0;
    };
  }, [conversationID]);

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
    const updateMessageNicknameAndFaceUrl = ({
      sendID,
      senderNickname,
      senderFaceUrl,
    }: UpdateMessaggeBaseInfoParams) => {
      setLoadState((preState) => {
        const tmpList = [...preState.messageList].map((message) => {
          if (message.sendID === sendID) {
            message.senderFaceUrl = senderFaceUrl;
            message.senderNickname = senderNickname;
          }
          return message;
        });
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
        hasMoreOld: true,
        hasMoreNew: true,
        messageList: [] as MessageItem[],
        firstItemIndex: START_INDEX,
      }));
      minSeq.current = 0;
    };
    emitter.on("PUSH_NEW_MSG", pushNewMessage);
    emitter.on("UPDATE_ONE_MSG", updateOneMessage);
    emitter.on("UPDATE_MSG_NICK_AND_FACEURL", updateMessageNicknameAndFaceUrl);
    emitter.on("DELETE_ONE_MSG", deleteOnewMessage);
    emitter.on("CLEAR_MSGS", clearMessages);
    return () => {
      emitter.off("PUSH_NEW_MSG", pushNewMessage);
      emitter.off("UPDATE_ONE_MSG", updateOneMessage);
      emitter.off("UPDATE_MSG_NICK_AND_FACEURL", updateMessageNicknameAndFaceUrl);
      emitter.off("DELETE_ONE_MSG", deleteOnewMessage);
      emitter.off("CLEAR_MSGS", clearMessages);
    };
  }, []);

  const loadHistoryMessages = () => getMoreOldMessages(false);

  const { loading: moreOldLoading, runAsync: getMoreOldMessages } = useRequest(
    async (loadMore = true) => {
      const reqConversationID = conversationID;
      const { data } = await IMSDK.getAdvancedHistoryMessageList({
        lastMinSeq: minSeq.current,
        count: SPLIT_COUNT,
        startClientMsgID: loadMore
          ? latestLoadState.current.messageList[0]?.clientMsgID
          : "",
        conversationID: conversationID ?? "",
        viewType: 0,
      });
      if (conversationID !== reqConversationID) return;
      setTimeout(() =>
        setLoadState((preState) => ({
          ...preState,
          initLoading: false,
          hasMoreOld: !data.isEnd,
          messageList: [...data.messageList, ...(loadMore ? preState.messageList : [])],
          firstItemIndex: preState.firstItemIndex - data.messageList.length,
        })),
      );
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
    moreOldLoading,
    getMoreOldMessages,
  };
}

export const pushNewMessage = (message: MessageItem) => emit("PUSH_NEW_MSG", message);
export const updateOneMessage = (message: MessageItem) =>
  emit("UPDATE_ONE_MSG", message);
export const updateMessageNicknameAndFaceUrl = (params: UpdateMessaggeBaseInfoParams) =>
  emit("UPDATE_MSG_NICK_AND_FACEURL", params);
export const deleteOneMessage = (clientMsgID: string) =>
  emit("DELETE_ONE_MSG", clientMsgID);
export const clearMessages = () => emit("CLEAR_MSGS");
