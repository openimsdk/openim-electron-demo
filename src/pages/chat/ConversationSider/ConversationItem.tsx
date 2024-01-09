import { Badge, Popover } from "antd";
import clsx from "clsx";
import type {
  ConversationItem,
  ConversationItem as ConversationItemType,
  MessageItem,
} from "open-im-sdk-wasm/lib/types/entity";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import OIMAvatar from "@/components/OIMAvatar";
import { useConversationStore } from "@/store";
import { formatConversionTime, formatMessageByType } from "@/utils/imCommon";

import styles from "./conversation-item.module.scss";
import ConversationMenuContent from "./ConversationMenuContent";

interface IConversationProps {
  conversation: ConversationItemType;
}

const ConversationItem = ({ conversation }: IConversationProps) => {
  const navigate = useNavigate();
  const [showConversationMenu, setShowConversationMenu] = useState(false);
  const updateCurrentConversation = useConversationStore(
    (state) => state.updateCurrentConversation,
  );

  const toSpecifiedConversation = () => {
    updateCurrentConversation({ ...conversation });
    navigate(`/chat/${conversation.conversationID}`);
  };

  const closeConversationMenu = () => {
    setShowConversationMenu(false);
  };

  const getLatestMessageContent = () => {
    if (conversation.latestMsg) {
      return formatMessageByType(JSON.parse(conversation.latestMsg) as MessageItem);
    }
    return "";
  };

  const latestMessageTime = formatConversionTime(conversation.latestMsgSendTime);

  return (
    <Popover
      overlayClassName="conversation-popover"
      placement="bottomRight"
      title={null}
      arrow={false}
      open={showConversationMenu}
      onOpenChange={(vis) => setShowConversationMenu(vis)}
      content={
        <ConversationMenuContent
          conversation={conversation}
          closeConversationMenu={closeConversationMenu}
        />
      }
      trigger="contextMenu"
    >
      <div
        className={clsx(
          styles["conversation-item"],
          conversation.isPinned && styles["conversation-item-pinned"],
        )}
        onClick={toSpecifiedConversation}
      >
        <Badge size="small" count={conversation.unreadCount}>
          <OIMAvatar
            src={conversation.faceURL}
            isgroup={Boolean(conversation.groupID)}
            text={conversation.showName}
          />
        </Badge>

        <div className={clsx("ml-3 flex-1 truncate", styles["content-wrap"])}>
          <div className="mb-1 truncate font-medium">{conversation.showName}</div>
          <div className="flex min-h-[16px] text-xs">
            <div className="truncate text-[rgba(81,94,112,0.5)]">
              {getLatestMessageContent()}
            </div>
          </div>
        </div>
        <div className="absolute right-3 flex flex-col items-end">
          <div className="mb-2 text-xs text-[var(--sub-text)]">{latestMessageTime}</div>
        </div>
      </div>
    </Popover>
  );
};

export default ConversationItem;
