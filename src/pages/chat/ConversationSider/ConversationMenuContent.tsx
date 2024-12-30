import { ConversationItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { Spin } from "antd";
import clsx from "clsx";
import { t } from "i18next";
import { FC, memo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
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

const ConversationMenuContent = memo(
  ({
    conversation,
    closeConversationMenu,
  }: {
    conversation: ConversationItem;
    closeConversationMenu: () => void;
  }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const delConversationByCID = useConversationStore(
      (state) => state.delConversationByCID,
    );
    const updateCurrentConversation = useConversationStore(
      (state) => state.updateCurrentConversation,
    );

    const updateConversationPin = async () => {
      setLoading(true);
      try {
        await IMSDK.setConversation({
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
        if (
          conversation.conversationID ===
          useConversationStore.getState().currentConversation?.conversationID
        ) {
          updateCurrentConversation();
          navigate("/chat");
        }
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
            title={
              conversation.isPinned
                ? t("placeholder.removeSticky")
                : t("placeholder.sticky")
            }
            onClick={updateConversationPin}
          />
          {Boolean(conversation.unreadCount) && (
            <MenuItem
              title={t("placeholder.markAsRead")}
              onClick={markConversationAsRead}
            />
          )}
          <MenuItem
            className="text-[#FF381F]"
            title={t("placeholder.remove")}
            onClick={removeConversation}
          />
        </div>
      </Spin>
    );
  },
);

export default ConversationMenuContent;
