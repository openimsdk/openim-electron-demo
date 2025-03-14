import type {
  ConversationItem,
  ConversationItem as ConversationItemType,
  MessageItem,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { Badge } from "antd";
import clsx from "clsx";
import { t } from "i18next";
import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import OIMAvatar from "@/components/OIMAvatar";
import { useConversationStore, useUserStore } from "@/store";
import { formatConversionTime, getConversationContent } from "@/utils/imCommon";

import styles from "./conversation-item.module.scss";

interface IConversationProps {
  isActive: boolean;
  conversation: ConversationItemType;
}

const ConversationItem = ({ isActive, conversation }: IConversationProps) => {
  const navigate = useNavigate();
  const updateCurrentConversation = useConversationStore(
    (state) => state.updateCurrentConversation,
  );
  const currentUser = useUserStore((state) => state.selfInfo.userID);

  const toSpecifiedConversation = async () => {
    if (isActive) {
      return;
    }
    await updateCurrentConversation({ ...conversation });
    navigate(`/chat/${conversation.conversationID}`);
  };

  const latestMessageContent = useMemo(() => {
    let content = "";
    if (!conversation.latestMsg) {
      return "";
    }
    try {
      content = getConversationContent(
        JSON.parse(conversation.latestMsg) as MessageItem,
      );
    } catch (error) {
      content = t("messageDescription.catchMessage");
    }
    return content;
  }, [conversation.draftText, conversation.latestMsg, isActive, currentUser]);

  const latestMessageTime = formatConversionTime(conversation.latestMsgSendTime);

  return (
    <div
      className={clsx(
        styles["conversation-item"],
        "border border-transparent",
        isActive && `bg-[var(--primary-active)]`,
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

      <div className="ml-3 flex h-11 flex-1 flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1 truncate font-medium">{conversation.showName}</div>
          <div className="ml-2 text-xs text-[var(--sub-text)]">{latestMessageTime}</div>
        </div>

        <div className="flex items-center">
          <div className="flex min-h-[16px] flex-1 items-center overflow-hidden text-xs">
            <div
              className="truncate text-[rgba(81,94,112,0.5)]"
              dangerouslySetInnerHTML={{
                __html: latestMessageContent,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ConversationItem);
