import face_2 from "@/assets/images/emojis/face_2.png";
import face_3 from "@/assets/images/emojis/face_3.png";
import face_4 from "@/assets/images/emojis/face_4.png";
import face_5 from "@/assets/images/emojis/face_5.png";
import face_6 from "@/assets/images/emojis/face_6.png";
import face_7 from "@/assets/images/emojis/face_7.png";
import face_8 from "@/assets/images/emojis/face_8.png";
import face_9 from "@/assets/images/emojis/face_9.png";
import face_10 from "@/assets/images/emojis/face_10.png";
import face_11 from "@/assets/images/emojis/face_11.png";
import face_12 from "@/assets/images/emojis/face_12.png";
import face_13 from "@/assets/images/emojis/face_13.png";
import face_14 from "@/assets/images/emojis/face_14.png";
import face_15 from "@/assets/images/emojis/face_15.png";
import face_16 from "@/assets/images/emojis/face_16.png";

const emojis = [
  {
    context: "[微笑]",
    reg: new RegExp(/\[微笑\]/g),
    src: face_2,
  },
  {
    context: "[哭泣]",
    reg: new RegExp(/\[哭泣\]/g),
    src: face_3,
  },
  {
    context: "[飞吻]",
    reg: new RegExp(/\[飞吻\]/g),
    src: face_4,
  },
  {
    context: "[疑问]",
    reg: new RegExp(/\[疑问\]/g),
    src: face_5,
  },
  {
    context: "[闭嘴]",
    reg: new RegExp(/\[闭嘴\]/g),
    src: face_6,
  },
  {
    context: "[开心]",
    reg: new RegExp(/\[开心\]/g),
    src: face_7,
  },
  {
    context: "[偷笑]",
    reg: new RegExp(/\[偷笑\]/g),
    src: face_8,
  },
  {
    context: "[发呆]",
    reg: new RegExp(/\[发呆\]/g),
    src: face_9,
  },
  {
    context: "[无语]",
    reg: new RegExp(/\[无语\]/g),
    src: face_10,
  },
  {
    context: "[难过]",
    reg: new RegExp(/\[难过\]/g),
    src: face_11,
  },
  {
    context: "[期待]",
    reg: new RegExp(/\[期待\]/g),
    src: face_12,
  },
  {
    context: "[捂脸笑]",
    reg: new RegExp(/\[捂脸笑\]/g),
    src: face_13,
  },
  {
    context: "[愤怒]",
    reg: new RegExp(/\[愤怒\]/g),
    src: face_14,
  },
  {
    context: "[斜眼看]",
    reg: new RegExp(/\[斜眼看\]/g),
    src: face_15,
  },
  {
    context: "[呲牙]",
    reg: new RegExp(/\[呲牙\]/g),
    src: face_16,
  },
];

export const formatEmoji = (str: string) => {
  emojis.map((emoji) => {
    if (str.includes(emoji.context)) {
      let imgStr = `<img class="emoji-inline" src="${emoji.src}" alt="${emoji.context}" />`;
      str = str.replace(emoji.reg, imgStr);
    }
  });
  return str;
};

export default emojis;
