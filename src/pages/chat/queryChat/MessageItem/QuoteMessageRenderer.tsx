import clsx from "clsx";
import { FC } from "react";

import file_icon from "@/assets/images/messageItem/file_icon.png";
import location from "@/assets/images/messageItem/location.png";
import { formatEmoji } from "@/utils/emojis";
import { formatMessageByType } from "@/utils/imCommon";

import { IMessageItemProps } from ".";

const QuoteMessageRenderer: FC<IMessageItemProps> = ({ message: { quoteElem } }) => {
  return (
    <div
      className={clsx(
        "mt-1 flex w-fit items-center rounded-md bg-[var(--chat-bubble)] p-2.5",
      )}
    >
      <div className="text-xs text-[var(--sub-text)]">{`${
        quoteElem.quoteMessage.senderNickname
      }：${formatEmoji(formatMessageByType(quoteElem.quoteMessage))}`}</div>
    </div>
  );
};

export default QuoteMessageRenderer;
