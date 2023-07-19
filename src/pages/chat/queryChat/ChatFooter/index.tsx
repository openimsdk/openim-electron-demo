import {
  useClickAway,
  useDebounceFn,
  useKeyPress,
  useLatest,
  useRequest,
  useThrottleFn,
} from "ahooks";
import { Button, Popover, Spin } from "antd";
import clsx from "clsx";
import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";

import cricle_cancel from "@/assets/images/chatFooter/cricle_cancel.png";
import EditableDiv, {
  EditableDivEvent,
  insertAtCursor,
} from "@/components/EditableDiv";
import OIMAvatar from "@/components/OIMAvatar";
import { useCurrentMemberRole } from "@/hooks/useCurrentMemberRole";
import { IMSDK } from "@/layout/MainContentWrap";
import { ExMessageItem, useConversationStore, useMessageStore } from "@/store";
import { base64toFile, getExtraStr } from "@/utils/common";
import { formatMessageByType } from "@/utils/imCommon";
import { GroupMemberItem } from "@/utils/open-im-sdk-wasm/types/entity";

import styles from "./chat-footer.module.scss";
import SendActionBar from "./SendActionBar";
import { useFileMessage } from "./SendActionBar/useFileMessage";
import { useSendMessage } from "./useSendMessage";

const ChatFooter = () => {
  const [html, setHtml] = useState("");
  const latestHtml = useLatest(html);
  const { conversationID } = useParams();

  const editableDivRef = useRef<{ el: RefObject<HTMLDivElement> }>(null);
  const quoteMessage = useConversationStore((state) => state.quoteMessage);
  const latestQuoteMessage = useLatest(quoteMessage);
  const updateQuoteMessage = useConversationStore((state) => state.updateQuoteMessage);

  const { createFileMessage } = useFileMessage();
  const { sendMessage } = useSendMessage();

  useEffect(() => {
    if (quoteMessage) {
      editableDivRef.current?.el.current?.focus();
    }
  }, [quoteMessage]);

  useEffect(() => {
    editableDivRef.current?.el.current?.focus();
  }, [conversationID]);

  const onChange = (e: EditableDivEvent) => {
    setHtml(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 90) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enterToSend();
    }
  };

  const getImageEl = () => {
    const imageEls = [...document.querySelectorAll(".image-el")] as HTMLImageElement[];
    imageEls.map(async (el) => {
      const file = base64toFile(el.src);
      const message = await createFileMessage(file);
      sendMessage({
        message,
      });
    });
  };

  const replaceEmoji2Str = (text: string) => {
    const editableDiv = document.getElementById("editable-div");
    if (!editableDiv) return text;

    const emojiEls: HTMLImageElement[] = Array.from(
      editableDiv.querySelectorAll(".emoji-inline"),
    );
    emojiEls.map((face) => {
      const escapedOut = face.outerHTML.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      text = text.replace(new RegExp(escapedOut, "g"), face.alt);
    });
    return text;
  };

  const getCleanText = (html: string) => {
    html = replaceEmoji2Str(html);
    const regWithoutHtml = /(<([^>]+)>)/gi;
    return html.replace(regWithoutHtml, "");
  };

  const getTextMessage = async () => {
    const cleanText = getCleanText(latestHtml.current);
    if (latestQuoteMessage.current) {
      return (
        await IMSDK.createQuoteMessage<ExMessageItem>({
          text: cleanText,
          message: JSON.stringify(latestQuoteMessage.current),
        })
      ).data;
    }

    return (await IMSDK.createTextMessage<ExMessageItem>(cleanText)).data;
  };

  const enterToSend = async () => {
    if (!latestHtml.current) return;
    getImageEl();
    const message = await getTextMessage();
    sendMessage({ message });
    setHtml("");
    if (latestQuoteMessage.current) {
      updateQuoteMessage();
    }
  };

  return (
    <footer className="relative rotate-180 bg-white py-px">
      <div className="absolute bottom-2 left-0 right-0 top-0 z-10 flex rotate-180 flex-col">
        <SendActionBar
          sendMessage={sendMessage}
          createFileMessage={createFileMessage}
        />
        <div className="relative flex flex-1 flex-col overflow-y-auto">
          {quoteMessage && (
            <div className="mx-5.5 mt-3 flex w-fit items-start rounded-md bg-[var(--chat-bubble)] px-2.5 py-2">
              <img
                className="mt-px cursor-pointer"
                width={13}
                src={cricle_cancel}
                alt="cancel"
                onClick={() => updateQuoteMessage()}
              />
              <div
                className="ml-1.5 line-clamp-1 text-xs text-[var(--sub-text)]"
                title=""
              >{`回复${quoteMessage.senderNickname}：${formatMessageByType(
                quoteMessage,
              )}`}</div>
            </div>
          )}
          <EditableDiv
            ref={editableDivRef as any}
            id="editable-div"
            className="flex-1"
            html={html}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <div className="flex items-center justify-end pb-6 pr-6">
            <span className="mr-2.5 text-xs text-[var(--sub-text)]">
              Enter发送/Shift+Enter换行
            </span>
            <Button className="px-6 py-1" type="primary" onClick={enterToSend}>
              发送
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.sider_resize}></div>
      <div className={styles.sider_bar}></div>
    </footer>
  );
};

export default memo(ChatFooter);
