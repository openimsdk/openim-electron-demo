import { Spin } from "antd";
import clsx from "clsx";
import { t } from "i18next";
import { FC, memo, useState } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { feedbackToast } from "@/utils/common";

const MenuItem: FC<{ title: string; className?: string; onClick: () => void }> = ({
  title,
  className,
  onClick,
}) => (
  <div
    className={clsx(
      "cursor-pointer rounded px-3 py-2 text-xs hover:bg-[var(--primary-active)]",
      className,
    )}
    onClick={onClick}
  >
    {title}
  </div>
);

const ConversationNavMenuContent = memo(
  ({ closeConversationMenu }: { closeConversationMenu: () => void }) => {
    const [loading, setLoading] = useState(false);

    const markConversationAsRead = async () => {
      setLoading(true);
      try {
        const { data: conversations } = await IMSDK.getAllConversationList();
        const unreadConversations = conversations.filter(
          (conversation) => conversation.unreadCount,
        );
        for (const conversation of unreadConversations) {
          await IMSDK.markConversationMessageAsRead(conversation.conversationID);
        }
      } catch (error) {
        feedbackToast({ error });
      }
      setLoading(false);
      closeConversationMenu();
    };

    return (
      <Spin spinning={loading}>
        <div className="p-1">
          <MenuItem
            title={t("placeholder.markAsRead")}
            onClick={markConversationAsRead}
          />
        </div>
      </Spin>
    );
  },
);

export default ConversationNavMenuContent;
