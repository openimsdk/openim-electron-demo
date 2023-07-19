import { Checkbox, Popover } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import clsx from "clsx";
import { FC, useCallback, useRef, useState } from "react";

import OIMAvatar from "@/components/OIMAvatar";
import { ExMessageItem, useMessageStore } from "@/store";
import { formatMessageTime } from "@/utils/imCommon";
import { MessageStatus, MessageType } from "@/utils/open-im-sdk-wasm/types/enum";

import CardMessageRenderer from "./CardMessageRenderer";
import CatchMessageRender from "./CatchMsgRenderer";
import FileMessageRenderer from "./FileMessageRenderer";
import LocationMessageRenderer from "./LocationMessageRenderer";
import MediaMessageRender from "./MediaMessageRender";
import MergeMessageRenderer from "./MergeMessageRenderer";
import styles from "./message-item.module.scss";
import MessageMenuContent from "./MessageMenuContent";
import MessageSuffix from "./MessageSuffix";
import QuoteMessageRenderer from "./QuoteMessageRenderer";
import TextMessageRender from "./TextMessageRender";
import VoiceMessageRender from "./VoiceMessageRender";

export interface IMessageItemProps {
  message: ExMessageItem;
  isSender: boolean;
  conversationID?: string;
}

const components: Record<number, FC<IMessageItemProps>> = {
  [MessageType.TextMessage]: TextMessageRender,
  [MessageType.AtTextMessage]: TextMessageRender,
  [MessageType.QuoteMessage]: TextMessageRender,
  [MessageType.VoiceMessage]: VoiceMessageRender,
  [MessageType.PictureMessage]: MediaMessageRender,
  [MessageType.VideoMessage]: MediaMessageRender,
  [MessageType.CardMessage]: CardMessageRenderer,
  [MessageType.FileMessage]: FileMessageRenderer,
  [MessageType.LocationMessage]: LocationMessageRenderer,
  [MessageType.MergeMessage]: MergeMessageRenderer,
};

const MessageItem: FC<IMessageItemProps> = ({ message, isSender, conversationID }) => {
  const messageWrapRef = useRef<HTMLDivElement>(null);
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const isCheckMode = useMessageStore((state) => state.isCheckMode);
  const updateMessage = useMessageStore((state) => state.updateOneMessage);
  const MessageRenderComponent = components[message.contentType] || CatchMessageRender;

  const isQuoteMessage = message.contentType === MessageType.QuoteMessage;

  const onCheckChange = (e: CheckboxChangeEvent) => {
    updateMessage({ ...message, checked: e.target.checked });
  };

  const tryShowUserCard = useCallback(() => {
    if (isSender) return;
    window.userClick(message.sendID, message.groupID);
  }, []);

  const closeMessageMenu = useCallback(() => {
    setShowMessageMenu(false);
  }, []);

  const messageIsSuccess = message.status === MessageStatus.Succeed;

  return (
    <div
      className={clsx(
        "relative flex px-5 py-3",
        message.errCode && "!pb-6",
        isCheckMode && "cursor-pointer",
      )}
      onClick={() =>
        isCheckMode &&
        onCheckChange({
          target: { checked: !message.checked },
        } as CheckboxChangeEvent)
      }
    >
      {isCheckMode && (
        <Checkbox
          checked={message.checked}
          disabled={false}
          onChange={onCheckChange}
          className="pointer-events-none mr-5 h-9"
        />
      )}
      <div
        className={clsx(
          styles["message-container"],
          isSender && styles["message-container-sender"],
          isCheckMode && "pointer-events-none",
        )}
      >
        <OIMAvatar
          size={36}
          src={message.senderFaceUrl}
          text={message.senderNickname}
          onClick={tryShowUserCard}
        />
        <div className={styles["message-wrap"]} ref={messageWrapRef}>
          <div className={styles["message-profile"]}>
            <div
              title={message.senderNickname}
              className={clsx(
                "max-w-[30%] truncate text-[var(--sub-text)]",
                isSender ? "ml-2" : "mr-2",
              )}
            >
              {message.senderNickname}
            </div>
            <div className="text-[var(--sub-text)]">
              {formatMessageTime(message.sendTime)}
            </div>
          </div>

          <Popover
            className={styles["menu-wrap"]}
            content={
              <MessageMenuContent
                message={message}
                conversationID={conversationID!}
                closeMenu={closeMessageMenu}
              />
            }
            title={null}
            trigger="contextMenu"
            open={messageIsSuccess ? showMessageMenu : false}
            onOpenChange={(vis) => setShowMessageMenu(vis)}
          >
            <MessageRenderComponent message={message} isSender={isSender} />
            <MessageSuffix
              message={message}
              isSender={isSender}
              conversationID={conversationID}
            />
          </Popover>

          {isQuoteMessage && (
            <QuoteMessageRenderer message={message} isSender={isSender} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
