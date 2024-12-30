import { Divider, Popover, Upload } from "antd";
import clsx from "clsx";
import { Picker } from "emoji-picker-element";
import { EmojiClickEvent } from "emoji-picker-element/shared";
import { t } from "i18next";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { memo, useEffect, useRef, useState } from "react";

import emoji_pop from "@/assets/images/chatFooter/emoji_pop.png";
import emoji_pop_active from "@/assets/images/chatFooter/emoji_pop_active.png";
import favorite from "@/assets/images/chatFooter/favorite.png";
import favorite_active from "@/assets/images/chatFooter/favorite_active.png";
import favorite_add from "@/assets/images/chatFooter/favorite_add.png";
import { EmojiData } from "@/components/CKEditor";
import { parseTwemoji } from "@/components/Twemoji";
import { IMSDK } from "@/layout/MainContentWrap";
import { uploadFile } from "@/utils/imCommon";
import { getUserCustomEmojis, setUserCustomEmojis } from "@/utils/storage";

import { CustomEmojiItem } from "../../MessageItem/FaceMessageRender";
import { useSendMessage } from "../useSendMessage";
import { FileWithPath } from "./useFileMessage";

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

const CustomEmojiItemEl = ({
  item,
  idx,
  deleteCallback,
  sendCustomEmoji,
}: {
  item?: CustomEmojiItem;
  idx: number;
  deleteCallback: (idx: number) => void;
  sendCustomEmoji: (item: CustomEmojiItem) => void;
}) => {
  const [showPop, setShowPop] = useState(false);

  const deleteCustomEmoji = () => {
    deleteCallback(idx);
    setShowPop(false);
  };

  return (
    <div
      className={clsx("h-[46px] w-[46px] rounded-md", {
        "cursor-pointer": Boolean(item),
        "bg-[var(--chat-bubble)]": !item,
      })}
    >
      <Popover
        content={
          <div className="p-1">
            <div
              className="flex cursor-pointer items-center rounded px-3 py-2 hover:bg-[var(--primary-active)]"
              onClick={deleteCustomEmoji}
            >
              <div className="text-xs text-red-400">{t("placeholder.delete")}</div>
            </div>
          </div>
        }
        open={item ? showPop : false}
        onOpenChange={(v) => setShowPop(v)}
        title={null}
        trigger="contextMenu"
      >
        {Boolean(item) && (
          <img
            className="h-[46px] w-[46px] object-contain"
            src={item?.url}
            alt=""
            onClick={() => sendCustomEmoji(item!)}
          />
        )}
      </Popover>
    </div>
  );
};

const CustomTabPane = ({ closeAllPop }: { closeAllPop?: () => void }) => {
  const [customEmojis, setCustomEmojis] = useState<CustomEmojiItem[]>([]);

  const { sendMessage } = useSendMessage();

  useEffect(() => {
    getUserCustomEmojis().then((emoijs) => setCustomEmojis(emoijs));
  }, []);

  const sendCustomEmoji = async (item: CustomEmojiItem) => {
    const message = (
      await IMSDK.createFaceMessage({
        index: -1,
        data: JSON.stringify(item),
      })
    ).data;
    sendMessage({ message });
    closeAllPop?.();
  };

  const fileHandle = async (options: UploadRequestOption) => {
    const file = options.file as FileWithPath;
    const { width, height } = await getPicInfo(file);
    const {
      data: { url },
    } = await uploadFile(file);
    const newCustomEmojis = [
      ...(await getUserCustomEmojis()),
      {
        url,
        path: file.path ?? "",
        width,
        height,
      },
    ];
    await setUserCustomEmojis(newCustomEmojis);
    setCustomEmojis(newCustomEmojis);
  };

  const deleteCustomEmoji = (idx: number) => {
    const newCustomEmojis = [...customEmojis];
    newCustomEmojis.splice(idx, 1);
    setUserCustomEmojis(newCustomEmojis);
    setCustomEmojis(newCustomEmojis);
  };

  const getPicInfo = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const _URL = window.URL || window.webkitURL;
      const img = new Image();
      img.onload = function () {
        resolve(img);
      };
      img.src = _URL.createObjectURL(file);
    });

  return (
    <div className="my-5 grid flex-1 grid-cols-6 gap-3 overflow-auto px-5">
      <Upload
        showUploadList={false}
        customRequest={fileHandle}
        accept="image/*"
        multiple
        className="mr-5 flex"
      >
        <img
          className="min-w-[46px] cursor-pointer"
          width={46}
          src={favorite_add}
          alt=""
        />
      </Upload>

      {Array.from({ length: 17 }, (_, i) => i).map((_, idx) => (
        <CustomEmojiItemEl
          key={idx}
          idx={idx}
          item={customEmojis[idx]}
          sendCustomEmoji={sendCustomEmoji}
          deleteCallback={deleteCustomEmoji}
        />
      ))}
    </div>
  );
};

const EmojiPopContent = ({
  sendEmoji,
  closeAllPop,
}: {
  sendEmoji?: (emoji: EmojiData) => void;
  closeAllPop?: () => void;
}) => {
  const [showCustom, setShowCustom] = useState(false);
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
      <div
        ref={ref}
        className={clsx("flex flex-1 flex-col overflow-hidden", showCustom && "hidden")}
      />
      {showCustom && <CustomTabPane closeAllPop={closeAllPop} />}
      <Divider className="border-1 m-0 border-[var(--gap-text)]" />
      <div className="flex px-4 py-2">
        <div
          className={clsx(
            "flex cursor-pointer items-center justify-center rounded-md px-3 py-1",
            { "bg-[rgba(19,31,65,0.05)]": !showCustom },
          )}
          onClick={() => setShowCustom(false)}
        >
          <img width={20} src={showCustom ? emoji_pop : emoji_pop_active} alt="" />
        </div>
        <div
          className={clsx(
            "flex cursor-pointer items-center justify-center rounded-md px-3 py-1",
            { "bg-[rgba(19,31,65,0.05)]": showCustom },
          )}
          onClick={() => setShowCustom(true)}
        >
          <img width={20} src={showCustom ? favorite_active : favorite} alt="" />
        </div>
      </div>
    </div>
  );
};

export default memo(EmojiPopContent);
