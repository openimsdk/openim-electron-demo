import { Layout, Spin } from "antd";
import clsx from "clsx";
import { memo, useEffect, useRef } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { SystemMessageTypes } from "@/constants/im";
import { useUserStore } from "@/store";
import emitter from "@/utils/events";

import MessageItem from "./MessageItem";
import NotificationMessage from "./NotificationMessage";
import { useHistoryMessageList } from "./useHistoryMessageList";

const ChatContent = ({ isNotificationSession }: { isNotificationSession: boolean }) => {
  const virtuoso = useRef<VirtuosoHandle>(null);
  const selfUserID = useUserStore((state) => state.selfInfo.userID);

  const { SPLIT_COUNT, conversationID, loadState, loading, getMoreMessages } =
    useHistoryMessageList();

  useEffect(() => {
    const toBottomHandle = (forceScroll: boolean) => {
      if (isNotificationSession) return;

      scrollToBottom(forceScroll ? "auto" : "smooth");
    };
    emitter.on("CHAT_LIST_SCROLL_TO_BOTTOM", toBottomHandle);
    return () => {
      emitter.off("CHAT_LIST_SCROLL_TO_BOTTOM", toBottomHandle);
    };
  }, [isNotificationSession]);

  const scrollToBottom = (behavior?: "smooth" | "auto") => {
    setTimeout(() => {
      virtuoso.current?.scrollToIndex({
        index: 999999,
        behavior,
      });
    });
  };

  const loadMoreMessage = () => {
    if (!loadState.hasMore || loading) return;

    getMoreMessages();
  };

  if (loadState.initLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-white pt-1">
        <Spin spinning />
      </div>
    );
  }

  return (
    <Layout.Content
      className="relative flex h-full overflow-hidden !bg-white"
      id="chat-main"
    >
      <Virtuoso
        id="chat-list"
        className="w-full overflow-x-hidden"
        firstItemIndex={loadState.firstItemIndex}
        initialTopMostItemIndex={SPLIT_COUNT - 1}
        ref={virtuoso}
        data={loadState.messageList}
        startReached={loadMoreMessage}
        components={{
          Header: () =>
            loadState.hasMore ? (
              <div
                className={clsx(
                  "flex justify-center py-2 opacity-0",
                  loading && "opacity-100",
                )}
              >
                <Spin />
              </div>
            ) : null,
        }}
        computeItemKey={(_, item) => item.clientMsgID}
        itemContent={(_, message) => {
          if (SystemMessageTypes.includes(message.contentType)) {
            return <NotificationMessage key={message.clientMsgID} message={message} />;
          }
          const isSender = selfUserID === message.sendID;
          return (
            <MessageItem
              key={message.clientMsgID}
              conversationID={conversationID}
              message={message}
              isSender={isSender}
            />
          );
        }}
      />
    </Layout.Content>
  );
};

export default memo(ChatContent);
