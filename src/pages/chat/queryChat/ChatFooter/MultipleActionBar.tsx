import { Spin } from "antd";
import { useState } from "react";

import cancel from "@/assets/images/chatFooter/cancel.png";
import forward from "@/assets/images/chatFooter/forward.png";
import remove from "@/assets/images/chatFooter/remove.png";
import { IMSDK } from "@/layout/MainContentWrap";
import { ExMessageItem, useConversationStore, useMessageStore } from "@/store";
import { feedbackToast } from "@/utils/common";
import emitter from "@/utils/events";
import { formatMessageByType, isGroupSession } from "@/utils/imCommon";

const multipleActionList = [
  {
    title: "合并转发",
    icon: forward,
  },
  {
    title: "删除",
    icon: remove,
  },
  {
    title: "关闭",
    icon: cancel,
  },
];

const MultipleActionBar = () => {
  const [loading, setLoading] = useState(false);
  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );
  const historyMessageList = useMessageStore((state) => state.historyMessageList);
  const updateCheckMode = useMessageStore((state) => state.updateCheckMode);
  const deleteOneMessage = useMessageStore((state) => state.deleteOneMessage);

  const actionClick = async (idx: number) => {
    switch (idx) {
      case 0:
        emitter.emit("OPEN_CHOOSE_MODAL", {
          type: "FORWARD_MESSAGE",
          extraData: await getMergeMessage(),
        });
        break;
      case 1:
        await batchDeleteMessage();
        break;
      default:
        break;
    }
    updateCheckMode(false);
  };

  const batchDeleteMessage = async () => {
    setLoading(true);
    const messageList = getCheckedMessageList();

    try {
      await Promise.all(
        messageList.map(async (message) => {
          try {
            await IMSDK.deleteMessage({
              clientMsgID: message.clientMsgID,
              conversationID: currentConversation!.conversationID,
            });
          } catch (error) {
            await IMSDK.deleteMessageFromLocalStorage({
              clientMsgID: message.clientMsgID,
              conversationID: currentConversation!.conversationID,
            });
            throw new Error("deleteMessage error");
          }
        }),
      );
      messageList.forEach((message) => deleteOneMessage(message.clientMsgID));
    } catch (error) {
      feedbackToast({ error: "部分消息删除失败" });
    }
    setLoading(false);
  };

  const getMergeMessage = async () => {
    const messageList = getCheckedMessageList();
    const summaryList = messageList
      .slice(0, 4)
      .map((message) => `${message.senderNickname}：${formatMessageByType(message)}`);
    return (
      await IMSDK.createMergerMessage<ExMessageItem>({
        messageList,
        summaryList,
        title: `${
          isGroupSession(currentConversation?.conversationType) ? "群聊" : "和"
        }${currentConversation?.showName}的聊天记录`,
      })
    ).data;
  };

  const getCheckedMessageList = () =>
    historyMessageList.filter((message) => message.checked);

  return (
    <Spin spinning={loading}>
      <div className="flex bg-[var(--chat-bubble)] px-16 py-4">
        {multipleActionList.map((action, idx) => (
          <div
            className="mr-8 flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-md bg-white last:mr-0"
            key={action.title}
            onClick={() => actionClick(idx)}
          >
            <img width={24} src={action.icon} className="mb-1.5 mt-2" alt="" />
            <span className="text-xs text-[var(--sub-text)]">{action.title}</span>
          </div>
        ))}
      </div>
    </Spin>
  );
};

export default MultipleActionBar;
