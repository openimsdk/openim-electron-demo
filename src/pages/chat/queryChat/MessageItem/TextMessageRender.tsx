import { FC } from "react";

import { formatBr } from "@/utils/common";

import { IMessageItemProps } from ".";
import styles from "./message-item.module.scss";

const TextMessageRender: FC<IMessageItemProps> = ({ message }) => {
  let content = message.textElem?.content;

  content = formatBr(content!);

  return (
    <div className={styles.bubble} dangerouslySetInnerHTML={{ __html: content }}></div>
  );
};

export default TextMessageRender;
