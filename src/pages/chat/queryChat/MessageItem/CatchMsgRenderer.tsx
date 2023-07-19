import { FC } from "react";

import styles from "./message-item.module.scss";

const CatchMessageRender: FC = () => {
  return <div className={styles.bubble}>{"[暂未支持的消息类型]"}</div>;
};

export default CatchMessageRender;
