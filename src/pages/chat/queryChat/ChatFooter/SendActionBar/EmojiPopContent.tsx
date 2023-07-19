import { Divider } from "antd";
import clsx from "clsx";
import { useState } from "react";

import emoji_pop from "@/assets/images/chatFooter/emoji_pop.png";
import emoji_pop_active from "@/assets/images/chatFooter/emoji_pop_active.png";
import { insertAtCursor } from "@/components/EditableDiv";
import emojis from "@/utils/emojis";

type EmojiItem = (typeof emojis)[0];

const EmojiTabPane = ({
  handleEmojiClick,
}: {
  handleEmojiClick: (emoji: EmojiItem) => void;
}) => (
  <>
    {emojis.map((emoji) => (
      <div
        className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center"
        key={emoji.context}
        onClick={() => handleEmojiClick(emoji)}
      >
        <img src={emoji.src} alt={emoji.context} />
      </div>
    ))}
  </>
);

const EmojiPopContent = () => {
  const [showFavorite, setShowFavorite] = useState(false);

  const handleEmojiClick = (emoji: EmojiItem) => {
    const image = new Image();
    image.setAttribute("class", "emoji-inline");
    image.setAttribute("alt", emoji.context);
    image.src = emoji.src;
    insertAtCursor([image]);
  };

  return (
    <div className="flex h-64 w-[370px] flex-col">
      <div className="my-5 grid flex-1 grid-cols-6 gap-3 overflow-auto px-5">
        <EmojiTabPane handleEmojiClick={handleEmojiClick} />
      </div>
      <Divider className="border-1 m-0 border-[var(--gap-text)]" />
      <div className="flex px-4 py-2">
        <div
          className={clsx(
            "flex cursor-pointer items-center justify-center rounded-md px-3 py-1",
            { "bg-[rgba(19,31,65,0.05)]": !showFavorite },
          )}
          onClick={() => setShowFavorite(false)}
        >
          <img width={20} src={showFavorite ? emoji_pop : emoji_pop_active} alt="" />
        </div>
      </div>
    </div>
  );
};

export default EmojiPopContent;
