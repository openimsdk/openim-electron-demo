import { MessageItem } from "@openim/wasm-client-sdk";
import clsx from "clsx";
import { FC, memo, useRef } from "react";

import { notificationMessageFormat } from "@/utils/imCommon";

const NotificationMessage: FC<{
  message: MessageItem;
}> = ({ message }) => {
  const messageWrapRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" id={`chat_${message.clientMsgID}`}>
      <div
        ref={messageWrapRef}
        className={clsx("mx-6 py-3 text-center text-xs text-[var(--sub-text)]")}
        dangerouslySetInnerHTML={{
          __html: String(notificationMessageFormat(message)),
        }}
      ></div>
    </div>
  );
};

export default memo(NotificationMessage);
