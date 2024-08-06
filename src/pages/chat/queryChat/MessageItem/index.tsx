import { MessageType } from "@openim/wasm-client-sdk";
import type { MessageItem } from "@openim/wasm-client-sdk/lib/types/entity";
import clsx from "clsx";
import { FC, memo, useCallback } from "react";

import OIMAvatar from "@/components/OIMAvatar";
import { useUserStore } from "@/store";
import { formatMessageTime } from "@/utils/imCommon";

import CatchMessageRender from "./CatchMsgRenderer";
import MediaMessageRender from "./MediaMessageRender";
import styles from "./message-item.module.scss";
import MessageItemErrorBoundary from "./MessageItemErrorBoundary";
import MessageSuffix from "./MessageSuffix";
import TextMessageRender from "./TextMessageRender";

export interface IMessageItemProps {
  message: MessageItem;
  isSender: boolean;
  disabled?: boolean;
  conversationID?: string;
  messageUpdateFlag?: string;
}

const components: Record<number, FC<IMessageItemProps>> = {
  [MessageType.TextMessage]: TextMessageRender,
  [MessageType.PictureMessage]: MediaMessageRender,
  [MessageType.VideoMessage]: MediaMessageRender,
};

const MessageItem: FC<IMessageItemProps> = ({
  message,
  disabled,
  isSender,
  conversationID,
}) => {
  const MessageRenderComponent = components[message.contentType] || CatchMessageRender;

  // locale re render
  useUserStore((state) => state.appSettings.locale);

  const tryShowUserCard = useCallback(() => {
    if (disabled) return;
    window.userClick(message.sendID);
  }, []);

  return (
    <>
      <div
        id={`chat_${message.clientMsgID}`}
        className="relative flex select-text px-5 py-3"
      >
        <div
          className={clsx(
            styles["message-container"],
            isSender && styles["message-container-sender"],
          )}
        >
          <OIMAvatar
            size={36}
            src={message.senderFaceUrl}
            text={message.senderNickname}
            onClick={tryShowUserCard}
          />

          <div className={styles["message-wrap"]}>
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

            <MessageItemErrorBoundary message={message}>
              <MessageRenderComponent
                message={message}
                isSender={isSender}
                disabled={disabled}
              />
            </MessageItemErrorBoundary>

            <MessageSuffix
              message={message}
              isSender={isSender}
              disabled={false}
              conversationID={conversationID}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(MessageItem);
