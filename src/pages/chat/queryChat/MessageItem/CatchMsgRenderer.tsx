import { t } from "i18next";
import { FC } from "react";

import styles from "./message-item.module.scss";

const CatchMessageRender: FC = () => {
  return <div className={styles.bubble}>{t("messageDescription.catchMessage")}</div>;
};

export default CatchMessageRender;
