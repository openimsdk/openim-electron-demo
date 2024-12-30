import { MessageReceiveOptType, SessionType } from "@openim/wasm-client-sdk";
import type {
  ConversationItem,
  ConversationItem as ConversationItemType,
  MessageItem,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { Badge, Popover } from "antd";
import clsx from "clsx";
import { t } from "i18next";
import { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import disturb from "@/assets/images/disturb.png";
import OIMAvatar from "@/components/OIMAvatar";
import { parseTwemoji } from "@/components/Twemoji";
import { useConversationStore, useUserStore } from "@/store";
import { formatConversionTime, getConversationContent } from "@/utils/imCommon";

import styles from "./conversation-item.module.scss";
import ConversationMenuContent from "./ConversationMenuContent";

interface IConversationProps {
  isActive: boolean;
  conversation: ConversationItemType;
}

const ConversationItem = ({ isActive, conversation }: IConversationProps) => {
  const navigate = useNavigate();
  const [showConversationMenu, setShowConversationMenu] = useState(false);
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

  const closeConversationMenu = () => {
    setShowConversationMenu(false);
  };

  const getMessagePrefix = () => {
    let prefix = "";

    if (notNomalReceive && conversation.unreadCount > 0) {
      prefix = t("messageDescription.unreadCount", { count: conversation.unreadCount });
    }

    return prefix;
  };

  const isNotification = conversation.conversationType === SessionType.Notification;

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
    return parseTwemoji(content);
  }, [conversation.draftText, conversation.latestMsg, isActive, currentUser]);

  const latestMessageTime = formatConversionTime(conversation.latestMsgSendTime);

  const notNomalReceive = conversation.recvMsgOpt !== MessageReceiveOptType.Normal;

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
          "border border-transparent",
          (isActive || conversation.isPinned) && `bg-[var(--primary-active)]`,
          conversation.isPinned && styles["conversation-item-pinned"],
        )}
        onClick={toSpecifiedConversation}
      >
        <Badge size="small" count={notNomalReceive ? 0 : conversation.unreadCount}>
          <OIMAvatar
            src={conversation.faceURL}
            isgroup={Boolean(conversation.groupID)}
            isnotification={isNotification}
            text={conversation.showName}
          />
        </Badge>

        <div className="ml-3 flex h-11 flex-1 flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex-1 truncate font-medium">{conversation.showName}</div>
            <div className="ml-2 text-xs text-[var(--sub-text)]">
              {latestMessageTime}
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex min-h-[16px] flex-1 items-center overflow-hidden text-xs">
              <div
                className={clsx("mr-px whitespace-nowrap text-[var(--primary)]", {
                  "!text-[var(--sub-text)]": notNomalReceive,
                })}
              >
                {getMessagePrefix()}
              </div>
              <div
                className="truncate text-[rgba(81,94,112,0.5)]"
                dangerouslySetInnerHTML={{
                  __html: latestMessageContent,
                }}
              ></div>
            </div>

            <img
              className={notNomalReceive ? "visible" : "invisible"}
              src={disturb}
              width={14}
              alt="disturb"
            />
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default memo(ConversationItem);
