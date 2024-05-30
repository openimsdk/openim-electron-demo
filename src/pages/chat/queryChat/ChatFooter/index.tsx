import { DownOutlined } from "@ant-design/icons";
import { useLatest } from "ahooks";
import { Button } from "antd";
import { t } from "i18next";
import { memo, useRef, useState } from "react";

import CKEditor, { CKEditorRef, EmojiData } from "@/components/CKEditor";
import { IMSDK } from "@/layout/MainContentWrap";

import SendActionBar from "./SendActionBar";
import { useFileMessage } from "./SendActionBar/useFileMessage";
import { useSendMessage } from "./useSendMessage";

const ChatFooter = () => {
  const [html, setHtml] = useState("");
  const latestHtml = useLatest(html);

  const ckRef = useRef<CKEditorRef>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(document.createElement("textarea"));

  const { createImageOrVideoMessage } = useFileMessage();
  const { sendMessage } = useSendMessage();

  const onChange = (value: string) => {
    setHtml(value);
  };

  const replaceEmoji2Str = (text: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const emojiEls: HTMLImageElement[] = Array.from(doc.querySelectorAll(".emojione"));
    emojiEls.map((face) => {
      // @ts-ignore
      const escapedOut = face.outerHTML.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      text = text.replace(new RegExp(escapedOut, "g"), face.alt);
    });
    return text;
  };

  const getCleanText = (html: string) => {
    let text = replaceEmoji2Str(html);
    text = text.replace(/<\/p><p>/g, "\n");
    text = text.replace(/<br\s*[/]?>/gi, "\n");
    text = text.replace(/<[^>]+>/g, "");
    text = convertChar(text);
    text = decodeHtmlEntities(text);
    return text.trim();
  };

  const decodeHtmlEntities = (text: string) => {
    textAreaRef.current.innerHTML = text;
    return textAreaRef.current.value;
  };

  const convertChar = (text: string) => text.replace(/&nbsp;/gi, " ");

  const enterToSend = async () => {
    const cleanText = getCleanText(latestHtml.current);
    const message = (await IMSDK.createTextMessage(cleanText)).data;
    setHtml("");
    if (!cleanText) return;

    sendMessage({ message });
  };

  const sendEmoji = (item: EmojiData) => ckRef.current?.insertEmoji(item);

  return (
    <footer className="relative h-full bg-white py-px">
      <div className="flex h-full flex-col border-t border-t-[var(--gap-text)]">
        <SendActionBar
          sendEmoji={sendEmoji}
          sendMessage={sendMessage}
          createImageOrVideoMessage={createImageOrVideoMessage}
        />
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <CKEditor
            ref={ckRef}
            value={html}
            onEnter={enterToSend}
            onChange={onChange}
          />
          <div className="flex items-center justify-end py-2 pr-3">
            <Button className="w-fit px-6 py-1" type="primary" onClick={enterToSend}>
              {t("placeholder.send")}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(ChatFooter);
