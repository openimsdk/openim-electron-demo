import { useRequest } from "ahooks";
import { Layout } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { SystemMessageTypes } from "@/constants/im";
import { useMessageStore, useUserStore } from "@/store";
import emitter from "@/utils/events";

import MessageItem from "./MessageItem";
import SystemNotification from "./SystemNotification";

const START_INDEX = 10000;
const INITIAL_ITEM_COUNT = 40;

const ChatContent = () => {
  const { conversationID } = useParams();
  const virtuoso = useRef<VirtuosoHandle>(null);

  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);
  const selfUserID = useUserStore((state) => state.selfInfo.userID);
  const messageList = useMessageStore((state) => state.historyMessageList);
  const hasMoreMessage = useMessageStore((state) => state.hasMore);
  const getHistoryMessageList = useMessageStore(
    (state) => state.getHistoryMessageListByReq,
  );

  const { loading, runAsync, cancel } = useRequest(getHistoryMessageList, {
    manual: true,
  });

  useEffect(() => {
    const toBottomHandle = () => {
      setTimeout(() =>
        virtuoso.current?.scrollToIndex({
          index: START_INDEX,
          behavior: "smooth",
        }),
      );
    };
    emitter.on("CHAT_LIST_SCROLL_TO_BOTTOM", toBottomHandle);
    return () => {
      cancel();
      emitter.off("CHAT_LIST_SCROLL_TO_BOTTOM", toBottomHandle);
    };
  }, []);

  const loadMoreMessage = useCallback(() => {
    if (loading || !hasMoreMessage) return;
    runAsync(true).then((count) => {
      setFirstItemIndex((idx) => idx - (count as number));
    });
  }, [loading, hasMoreMessage]);

  return (
    <Layout.Content className="!bg-white">
      <Virtuoso
        className="h-full overflow-x-hidden"
        firstItemIndex={firstItemIndex}
        initialTopMostItemIndex={INITIAL_ITEM_COUNT - 1}
        ref={virtuoso}
        overscan={{
          main: 800,
          reverse: 1200,
        }}
        data={messageList}
        startReached={loadMoreMessage}
        components={{
          Header: () => (loading ? <div>loading...</div> : null),
        }}
        itemContent={(_, message) => {
          if (SystemMessageTypes.includes(message.contentType)) {
            return <SystemNotification message={message} />;
          }
          const isSender = selfUserID === message.sendID;
          return (
            <MessageItem
              conversationID={conversationID}
              message={message}
              isSender={isSender}
              key={message.clientMsgID}
            />
          );
        }}
      />
    </Layout.Content>
  );
};

export default ChatContent;
