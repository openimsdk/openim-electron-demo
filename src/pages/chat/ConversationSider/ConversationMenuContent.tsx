import { Spin } from "antd";
import { t } from "i18next";
import { ConversationItem } from "open-im-sdk-wasm/lib/types/entity";
import { FC, memo, useState } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { feedbackToast } from "@/utils/common";

const MenuItem: FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
  <div
    className="cursor-pointer rounded px-3 py-2 text-xs hover:bg-[var(--primary-active)]"
    onClick={onClick}
  >
    {title}
  </div>
);

const ConversationMenuContent = memo(
  ({
    conversation,
    closeConversationMenu,
  }: {
    conversation: ConversationItem;
    closeConversationMenu: () => void;
  }) => {
    const [loading, setLoading] = useState(false);
    const delConversationByCID = useConversationStore(
      (state) => state.delConversationByCID,
    );

    const updateConversationPin = async () => {
      setLoading(true);
      try {
        await IMSDK.pinConversation({
          conversationID: conversation.conversationID,
          isPinned: !conversation.isPinned,
        });
      } catch (error) {
        feedbackToast({ error, msg: t("toast.pinConversationFailed") });
      }
      setLoading(false);
      closeConversationMenu();
    };

    const removeConversation = async () => {
      setLoading(true);
      try {
        await IMSDK.deleteConversationAndDeleteAllMsg(conversation.conversationID);
        delConversationByCID(conversation.conversationID);
      } catch (error) {
        feedbackToast({ error, msg: t("toast.deleteConversationFailed") });
      }
      setLoading(false);
      closeConversationMenu();
    };

    const markConversationAsRead = async () => {
      setLoading(true);
      try {
        await IMSDK.markConversationMessageAsRead(conversation.conversationID);
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
            title={`${conversation.isPinned ? t("cancel") : ""}${t(
              "placeholder.sticky",
            )}`}
            onClick={updateConversationPin}
          />
          {Boolean(conversation.unreadCount) && (
            <MenuItem
              title={t("placeholder.markAsRead")}
              onClick={markConversationAsRead}
            />
          )}
          <MenuItem title={t("placeholder.remove")} onClick={removeConversation} />
        </div>
      </Spin>
    );
  },
);

export default ConversationMenuContent;
