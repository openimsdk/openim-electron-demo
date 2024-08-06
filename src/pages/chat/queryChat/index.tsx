import { SessionType } from "@openim/wasm-client-sdk";
import { useUnmount } from "ahooks";
import { Layout } from "antd";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { useConversationStore } from "@/store";

import ChatContent from "./ChatContent";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import useConversationState from "./useConversationState";

export const QueryChat = () => {
  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );
  const updateCurrentConversation = useConversationStore(
    (state) => state.updateCurrentConversation,
  );

  useConversationState();

  const isNotificationSession =
    currentConversation?.conversationType === SessionType.Notification;

  useUnmount(() => {
    updateCurrentConversation();
  });

  const switchFooter = () => {
    if (isNotificationSession) {
      return null;
    }

    return (
      <>
        <PanelResizeHandle />
        <Panel
          id="chat-footer"
          order={1}
          defaultSize={25}
          maxSize={60}
          className="min-h-[200px]"
        >
          <ChatFooter />
        </Panel>
      </>
    );
  };

  return (
    <Layout id="chat-container" className="relative overflow-hidden">
      <ChatHeader />
      <PanelGroup direction="vertical">
        <Panel id="chat-main" order={0}>
          <ChatContent isNotificationSession={isNotificationSession} />
        </Panel>
        {switchFooter()}
      </PanelGroup>
    </Layout>
  );
};
