export const avatarList = [
  {
    src: new URL("@/assets/avatar/ic_avatar_01.png", import.meta.url).href,
    name: "ic_avatar_01",
  },
  {
    src: new URL("@/assets/avatar/ic_avatar_02.png", import.meta.url).href,
    name: "ic_avatar_02",
  },
  {
    src: new URL("@/assets/avatar/ic_avatar_03.png", import.meta.url).href,
    name: "ic_avatar_03",
  },
  {
    src: new URL("@/assets/avatar/ic_avatar_04.png", import.meta.url).href,
    name: "ic_avatar_04",
  },
  {
    src: new URL("@/assets/avatar/ic_avatar_05.png", import.meta.url).href,
    name: "ic_avatar_05",
  },
  {
    src: new URL("@/assets/avatar/ic_avatar_06.png", import.meta.url).href,
    name: "ic_avatar_06",
  },
];

export const getDefaultAvatar = (name: string) => {
  return avatarList.find((avator) => avator.name === name)?.src;
};
