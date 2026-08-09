import { FC } from "react";

import { formatBr } from "@/utils/common";

import { IMessageItemProps } from ".";
import styles from "./message-item.module.scss";

const TextMessageRender: FC<IMessageItemProps> = ({ message }) => {
  const content = formatBr(message.textElem?.content ?? "");

  return (
    <div className={styles.bubble} dangerouslySetInnerHTML={{ __html: content }}></div>
  );
};

export default TextMessageRender;
