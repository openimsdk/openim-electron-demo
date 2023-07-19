import { FC } from "react";

import { ExMessageItem } from "@/store";
import { systemNotificationFormat } from "@/utils/imCommon";

const SystemNotification: FC<{ message: ExMessageItem }> = ({ message }) => {
  return (
    <div
      className="relative mx-6 py-3 text-center text-xs text-[var(--sub-text)]"
      dangerouslySetInnerHTML={{ __html: systemNotificationFormat(message) }}
    ></div>
  );
};

export default SystemNotification;
