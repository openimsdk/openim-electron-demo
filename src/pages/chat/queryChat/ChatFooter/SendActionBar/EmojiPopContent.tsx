import { Divider } from "antd";
import { Picker } from "emoji-picker-element";
import { EmojiClickEvent } from "emoji-picker-element/shared";
import { memo, useEffect, useRef } from "react";

import emoji_pop_active from "@/assets/images/chatFooter/emoji_pop_active.png";
import { EmojiData } from "@/components/CKEditor";
import { parseTwemoji } from "@/components/Twemoji";

const emojiPicker = new Picker({
  emojiVersion: 14,
  dataSource: `${window.electronAPI?.getDataPath("public") ?? ""}/emojis.json`,
});
emojiPicker.className = "light w-full h-full";
const style = document.createElement("style");
style.textContent = `
    .search-row,.favorites {
      display: none;
    }
    .tabpanel::-webkit-scrollbar {
      width: 6px;
      background-color: transparent;
    }
    .tabpanel::-webkit-scrollbar-track {
      background: transparent;
    }
    .tabpanel::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: #b7bdcb;
      box-shadow: 4px 4px 15px rgba(112, 124, 151, 0.05),
        2px 2px 10px rgba(112, 124, 151, 0.1), 1px 1px 50px rgba(112, 124, 151, 0.15);
    }
    .tabpanel::-webkit-scrollbar-thumb:hover {
      border-radius: 3px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: rgba(245, 238, 238, 1);
    }
`;
emojiPicker.shadowRoot?.appendChild(style);

const EmojiPopContent = ({
  sendEmoji,
  closeAllPop,
}: {
  sendEmoji?: (emoji: EmojiData) => void;
  closeAllPop?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.appendChild(emojiPicker);
    const emojiClickHander = (event: EmojiClickEvent) => {
      const imgStr = parseTwemoji(event.detail.unicode!);
      const parser = new DOMParser();
      const doc = parser.parseFromString(imgStr, "text/html");
      const nodes = Array.from(doc.body.childNodes);
      sendEmoji?.({
        // @ts-ignore
        src: nodes[0].getAttribute("src"),
        alt: event.detail.unicode!,
      });
      closeAllPop?.();
    };
    // @ts-ignore
    emojiPicker.addEventListener("emoji-click", emojiClickHander);
    return () => {
      emojiPicker.removeEventListener("emoji-click", emojiClickHander);
    };
  }, []);

  return (
    <div className="flex h-64 w-[380px] flex-col">
      <div ref={ref} className="flex flex-1 flex-col overflow-hidden" />
      <Divider className="border-1 m-0 border-[var(--gap-text)]" />
      <div className="flex px-4 py-2">
        <div className="flex cursor-pointer items-center justify-center rounded-md bg-[rgba(19,31,65,0.05)] px-3 py-1">
          <img width={20} src={emoji_pop_active} alt="" />
        </div>
      </div>
    </div>
  );
};

export default memo(EmojiPopContent);
