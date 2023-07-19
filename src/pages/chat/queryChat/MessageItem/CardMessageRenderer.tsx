import { FC } from "react";

import OIMAvatar from "@/components/OIMAvatar";
import emitter from "@/utils/events";

import { IMessageItemProps } from ".";
import styles from "./message-item.module.scss";

const CardMessageRenderer: FC<IMessageItemProps> = ({ message }) => {
  const cardData = message.cardElem;
  return (
    <div
      className={styles["card-shadow"]}
      onClick={() =>
        emitter.emit("OPEN_USER_CARD", {
          userID: cardData.userID,
        })
      }
    >
      <div className="flex items-center bg-[#e6f3ff] p-4">
        <OIMAvatar src={cardData.faceURL} size={36} text={cardData.nickname} />
        <div className="ml-3 truncate" title={cardData.nickname}>
          {cardData.nickname}
        </div>
      </div>
      <div className="py-1.5 pl-4 text-xs text-[var(--sub-text)]">个人名片</div>
    </div>
  );
};

export default CardMessageRenderer;
