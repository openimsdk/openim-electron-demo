import { FC } from "react";

import { formatBr } from "@/utils/common";
import { formatEmoji } from "@/utils/emojis";
import { formatAtText } from "@/utils/imCommon";
import { MessageType } from "@/utils/open-im-sdk-wasm/types/enum";

import { IMessageItemProps } from ".";
import styles from "./message-item.module.scss";

const TextMessageRender: FC<IMessageItemProps> = ({ message }) => {
  let content = message.textElem?.content;

  if (message.contentType === MessageType.QuoteMessage) {
    content = message.quoteElem.text;
  }
  if (message.contentType === MessageType.AtTextMessage) {
    content = formatAtText(message.atTextElem);
  }

  content = formatEmoji(content);
  content = formatBr(content);

  return (
    <div className={styles.bubble} dangerouslySetInnerHTML={{ __html: content }}></div>
  );
};

export default TextMessageRender;
