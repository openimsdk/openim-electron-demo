import { useRequest, useUnmount } from "ahooks";
import { Layout } from "antd";
import { t } from "i18next";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useConversationStore, useMessageStore } from "@/store";

import ChatContent from "./ChatContent";
import ChatFooter from "./ChatFooter";
import MultipleActionBar from "./ChatFooter/MultipleActionBar";
import ChatHeader from "./ChatHeader";
import useConversationState from "./useConversationState";

export const QueryChat = () => {
  const { conversationID } = useParams();

  const isCheckMode = useMessageStore((state) => state.isCheckMode);
  const updateCurrentConversation = useConversationStore(
    (state) => state.updateCurrentConversation,
  );
  const getHistoryMessageList = useMessageStore(
    (state) => state.getHistoryMessageListByReq,
  );

  const { loading, run, cancel } = useRequest(getHistoryMessageList, {
    manual: true,
  });

  useConversationState();

  useEffect(() => {
    run();
    return () => {
      cancel();
    };
  }, [conversationID]);

  useUnmount(() => {
    updateCurrentConversation();
  });

  const switchFooter = () => {
    if (isCheckMode) {
      return <MultipleActionBar />;
    }
    return <ChatFooter />;
  };

  return (
    <Layout id="chat-container">
      <ChatHeader />
      {loading ? <div className="h-full">loading..</div> : <ChatContent />}
      {switchFooter()}
    </Layout>
  );
};
