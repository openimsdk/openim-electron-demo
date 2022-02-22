import { Avatar, AvatarProps } from "antd";
import ic_avatar_01 from "@/assets/images/ic_avatar_01.png";
import ic_avatar_02 from "@/assets/images/ic_avatar_02.png";
import ic_avatar_03 from "@/assets/images/ic_avatar_03.png";
import ic_avatar_04 from "@/assets/images/ic_avatar_04.png";
import ic_avatar_05 from "@/assets/images/ic_avatar_05.png";
import ic_avatar_06 from "@/assets/images/ic_avatar_06.png";
import { UserOutlined } from "@ant-design/icons";

export const MyAvatar = (props: AvatarProps) => {
  let mySrc;
  const localList = {
    ic_avatar_01: ic_avatar_01,
    ic_avatar_02: ic_avatar_02,
    ic_avatar_03: ic_avatar_03,
    ic_avatar_04: ic_avatar_04,
    ic_avatar_05: ic_avatar_05,
    ic_avatar_06: ic_avatar_06,
  };

  if (Object.keys(localList).includes(props.src as string)) {
    //@ts-ignore
    mySrc = localList[props.src as string];
  } else {
    mySrc = props.src;
  }

  return (
      <Avatar
        shape="square"
        icon={<UserOutlined />}
        style={{ minWidth: `${props.size ?? 42}px` }}
        {...props}
        src={mySrc}
      />
  );
};
