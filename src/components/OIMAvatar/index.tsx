import { Avatar as AntdAvatar, AvatarProps } from "antd";
import clsx from "clsx";
import * as React from "react";
import { useMemo } from "react";

// import default_group from "@/assets/images/contact/group.png";
import default_group from "@/assets/images/contact/my_groups.png";

interface IOIMAvatarProps extends AvatarProps {
  text?: string;
  color?: string;
  bgColor?: string;
  isgroup?: boolean;
  isnotification?: boolean;
  size?: number;
}

const OIMAvatar: React.FC<IOIMAvatarProps> = (props) => {
  const {
    src,
    text,
    size = 42,
    color = "#fff",
    bgColor = "#2074de",
    isgroup = false,
    isnotification,
  } = props;
  const getAvatarUrl = useMemo(() => {
    if (src) {
      return src;
    }
    return isgroup ? default_group : undefined;
  }, [src, isgroup, isnotification]);

  const avatarProps = { ...props, isgroup: undefined, isnotification: undefined };
  return (
    <AntdAvatar
      style={{
        backgroundColor: bgColor,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        lineHeight: `${size - 2}px`,
        color,
      }}
      shape="square"
      {...avatarProps}
      className={clsx(
        {
          "cursor-pointer": Boolean(props.onClick),
        },
        props.className,
      )}
      src={getAvatarUrl}
    >
      {text}
    </AntdAvatar>
  );
};

export default OIMAvatar;
