import { ExclamationCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { MessageStatus, MessageType } from "open-im-sdk-wasm";
import { FC, useEffect, useState } from "react";

import { IMessageItemProps } from ".";
import styles from "./message-item.module.scss";

const MessageSuffix: FC<IMessageItemProps> = ({ message }) => {
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
      {showSending &&
        message.status === MessageStatus.Sending &&
        message.contentType === MessageType.TextMessage && (
          <Spin
            className="flex"
            indicator={
              <LoadingOutlined style={{ fontSize: 16 }} spin rev={undefined} />
            }
          />
        )}
      {message.status === MessageStatus.Failed && (
        <ExclamationCircleFilled className="text-base text-[var(--warn-text)]" />
      )}
    </div>
  );
};

export default MessageSuffix;
