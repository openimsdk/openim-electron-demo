import { useRef } from "react";
import { useParams } from "react-router-dom";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import FlexibleSider from "@/components/FlexibleSider";
import { useConversationStore } from "@/store";

import ConversationItemComp from "./ConversationItem";

const ConversationSider = () => {
  const { conversationID } = useParams();
  const conversationList = useConversationStore((state) => state.conversationList);
  const getConversationListByReq = useConversationStore(
    (state) => state.getConversationListByReq,
  );
  const virtuoso = useRef<VirtuosoHandle>(null);
  const hasmore = useRef(true);

  const endReached = async () => {
    if (!hasmore.current) return;
    hasmore.current = await getConversationListByReq(true);
  };

  return (
    <div>
      <FlexibleSider
        needHidden={Boolean(conversationID)}
        wrapClassName="left-2 right-2 top-1.5 flex flex-col"
      >
        <Virtuoso
          className="flex-1"
          data={conversationList}
          ref={virtuoso}
          endReached={endReached}
          computeItemKey={(_, item) => item.conversationID}
          itemContent={(_, conversation) => (
            <ConversationItemComp
              isActive={conversationID === conversation.conversationID}
              conversation={conversation}
            />
          )}
        />
      </FlexibleSider>
    </div>
  );
};

export default ConversationSider;
