import { useRef } from "react";
import { useMatches } from "react-router-dom";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import FlexibleSider from "@/components/FlexibleSider";
import { useConversationStore } from "@/store";

import ConversationItem from "./ConversationItem";

const ConversationSider = () => {
  const matches = useMatches();
  const conversationList = useConversationStore((state) => state.conversationList);
  const virtuoso = useRef<VirtuosoHandle>(null);

  const inConversation = Boolean(matches[matches.length - 1].params.conversationID);

  return (
    <FlexibleSider needHidden={inConversation} wrapClassName="left-2 right-2 top-3">
      <Virtuoso
        data={conversationList}
        ref={virtuoso}
        itemContent={(_, conversation) => (
          <ConversationItem conversation={conversation} />
        )}
      />
    </FlexibleSider>
  );
};

export default ConversationSider;
