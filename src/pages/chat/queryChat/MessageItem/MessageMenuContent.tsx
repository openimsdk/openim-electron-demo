import { t } from "i18next";
import { memo } from "react";
import { useCopyToClipboard } from "react-use";

import check from "@/assets/images/messageMenu/check.png";
import copy from "@/assets/images/messageMenu/copy.png";
import forward from "@/assets/images/messageMenu/forward.png";
import remove from "@/assets/images/messageMenu/remove.png";
import reply from "@/assets/images/messageMenu/reply.png";
import revoke from "@/assets/images/messageMenu/revoke.png";
import { IMSDK } from "@/layout/MainContentWrap";
import {
  ExMessageItem,
  useConversationStore,
  useMessageStore,
  useUserStore,
} from "@/store";
import { feedbackToast } from "@/utils/common";
import emitter from "@/utils/events";
import { MessageType } from "@/utils/open-im-sdk-wasm/types/enum";

const messageMenuList = [
  {
    idx: 1,
    title: t("placeholder.forward"),
    icon: forward,
    hidden: false,
  },
  {
    idx: 2,
    title: t("placeholder.copy"),
    icon: copy,
    hidden: false,
  },
  {
    idx: 3,
    title: t("placeholder.check"),
    icon: check,
    hidden: false,
  },
  {
    idx: 4,
    title: t("placeholder.reply"),
    icon: reply,
    hidden: false,
  },
  {
    idx: 5,
    title: t("placeholder.revoke"),
    icon: revoke,
    hidden: false,
  },
  {
    idx: 6,
    title: t("placeholder.delete"),
    icon: remove,
    hidden: false,
  },
];

const canCopyTypes = [
  MessageType.TextMessage,
  MessageType.AtTextMessage,
  MessageType.QuoteMessage,
];

const MessageMenuContent = ({
  message,
  conversationID,
  closeMenu,
}: {
  message: ExMessageItem;
  conversationID: string;
  closeMenu: () => void;
}) => {
  const selfUserID = useUserStore((state) => state.selfInfo.userID);
  const ownerUserID = useConversationStore(
    (state) => state.currentGroupInfo?.ownerUserID,
  );
  const updateCheckMode = useMessageStore((state) => state.updateCheckMode);
  const updateOneMessage = useMessageStore((state) => state.updateOneMessage);
  const deleteOneMessage = useMessageStore((state) => state.deleteOneMessage);
  const updateQuoteMessage = useConversationStore((state) => state.updateQuoteMessage);

  const [_, copyToClipboard] = useCopyToClipboard();

  const menuClick = async (idx: number) => {
    switch (idx) {
      case 1:
        emitter.emit("OPEN_CHOOSE_MODAL", {
          type: "FORWARD_MESSAGE",
          extraData: (await IMSDK.createForwardMessage(message)).data,
        });
        break;
      case 2:
        copyToClipboard(getCopyText());
        feedbackToast({ msg: t("toast.copySuccess") });
        break;
      case 3:
        updateCheckMode(true);
        break;
      case 4:
        updateQuoteMessage(message);
        break;
      case 5:
        tryRevoke();
        break;
      case 6:
        tryRemove();
        break;
      default:
        break;
    }
    closeMenu();
  };

  const tryRevoke = async () => {
    try {
      await IMSDK.revokeMessage({ conversationID, clientMsgID: message.clientMsgID });
      updateOneMessage({
        ...message,
        contentType: MessageType.RevokeMessage,
        notificationElem: {
          detail: JSON.stringify({
            clientMsgID: message.clientMsgID,
            revokeTime: Date.now(),
            revokerID: selfUserID,
            revokerNickname: t("you"),
            revokerRole: 0,
            seq: message.seq,
            sessionType: message.sessionType,
            sourceMessageSendID: message.sendID,
            sourceMessageSendTime: message.sendTime,
            sourceMessageSenderNickname: message.senderNickname,
          }),
        },
      });
    } catch (error) {
      feedbackToast({ error });
    }
  };

  const tryRemove = async () => {
    try {
      await IMSDK.deleteMessage({ clientMsgID: message.clientMsgID, conversationID });
      deleteOneMessage(message.clientMsgID);
    } catch (error) {
      feedbackToast({ error });
    }
  };

  const getCopyText = () => {
    if (message.contentType === MessageType.AtTextMessage) {
      return message.atTextElem.text;
    }
    if (message.contentType === MessageType.QuoteMessage) {
      return message.quoteElem.text;
    }
    return message.textElem.content;
  };

  const senderIsOwner = message.sendID === ownerUserID;
  const isSender = message.sendID === selfUserID;
  const sendOneDayBefore = message.sendTime < Date.now() - 24 * 60 * 60 * 1000;

  return (
    <div className="p-1">
      {messageMenuList.map((menu) => {
        if (menu.idx === 2 && !canCopyTypes.includes(message.contentType)) {
          return null;
        }
        if (menu.idx === 5 && !isSender) {
          return null;
        }
        return (
          <div
            className="flex cursor-pointer items-center rounded px-3 py-2 hover:bg-[var(--primary-active)]"
            key={menu.idx}
            onClick={() => menuClick(menu.idx)}
          >
            <img className="mr-2 h-3.5" width={14} src={menu.icon} alt={menu.title} />
            <div className="text-xs">{menu.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(MessageMenuContent);
