import { ExclamationCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { FC, useEffect, useState } from "react";

import { MessageStatus } from "@/utils/open-im-sdk-wasm/types/enum";

import { IMessageItemProps } from ".";
import styles from "./message-item.module.scss";

const MessageSuffix: FC<IMessageItemProps> = ({ message, conversationID }) => {
  const [showSending, setShowSending] = useState(false);

  useEffect(() => {
    if (message.status !== MessageStatus.Sending) return;
    const timer = setTimeout(() => {
      if (message.status === MessageStatus.Sending) {
        setShowSending(true);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [message.status]);

  return (
    <div className={styles.suffix}>
      {showSending && message.status === MessageStatus.Sending && (
        <Spin
          className="flex"
          indicator={<LoadingOutlined style={{ fontSize: 16 }} spin rev={undefined} />}
        />
      )}
      {message.status === MessageStatus.Failed && (
        <ExclamationCircleFilled
          className="text-base text-[var(--warn-text)]"
          rev={undefined}
        />
      )}
    </div>
  );
};

export default MessageSuffix;
