import { MessageItem } from "@openim/wasm-client-sdk/lib/types/entity";
import clsx from "clsx";
import { FC, memo } from "react";

import { notificationMessageFormat } from "@/utils/imCommon";

const NotificationMessage: FC<{
  message: MessageItem;
}> = ({ message }) => {
  return (
    <div className="relative" id={`chat_${message.clientMsgID}`}>
      <div
        className={clsx("mx-6 py-3 text-center text-xs text-[var(--sub-text)]")}
        dangerouslySetInnerHTML={{
          __html: String(notificationMessageFormat(message)),
        }}
      ></div>
    </div>
  );
};

export default memo(NotificationMessage);
