import { RightOutlined } from "@ant-design/icons";
import { Badge, Divider, Layout, Popover, Upload } from "antd";
import clsx from "clsx";
import { UploadRequestOption } from "rc-upload/lib/interface";
import React, { memo, useRef, useState } from "react";
import {
  UNSAFE_NavigationContext,
  useNavigate,
  useResolvedPath,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

import { modal } from "@/AntdGlobalComp";
import { updateBusinessUserInfo } from "@/api/login";
import contact_icon from "@/assets/images/nav/nav_bar_contact.png";
import contact_icon_active from "@/assets/images/nav/nav_bar_contact_active.png";
import message_icon from "@/assets/images/nav/nav_bar_message.png";
import message_icon_active from "@/assets/images/nav/nav_bar_message_active.png";
import change_avatar from "@/assets/images/profile/change_avatar.png";
import OIMAvatar from "@/components/OIMAvatar";
import { useContactStore, useConversationStore, useUserStore } from "@/store";
import { feedbackToast, getFileType } from "@/utils/common";
import emitter from "@/utils/events";

import { OverlayVisibleHandle } from "../../hooks/useOverlayVisible";
import { IMSDK } from "../MainContentWrap";
import About from "./About";
import styles from "./left-nav-bar.module.scss";
import PersonalSettings from "./PersonalSettings";

const { Sider } = Layout;

const NavList = [
  {
    icon: message_icon,
    icon_active: message_icon_active,
    title: "消息",
    path: "/chat",
  },
  {
    icon: contact_icon,
    icon_active: contact_icon_active,
    title: "通讯录",
    path: "/contact",
  },
];

type NavItemType = (typeof NavList)[0];

const NavItem = ({ nav: { icon, icon_active, title, path } }: { nav: NavItemType }) => {
  const resolvedPath = useResolvedPath(path);
  const { navigator } = React.useContext(UNSAFE_NavigationContext);
  const toPathname = navigator.encodeLocation
    ? navigator.encodeLocation(path).pathname
    : resolvedPath.pathname;
  const locationPathname = location.pathname;
  const isActive =
    locationPathname === toPathname ||
    (locationPathname.startsWith(toPathname) &&
      locationPathname.charAt(toPathname.length) === "/") ||
    location.hash.startsWith(`#${toPathname}`);

  const unReadCount = useConversationStore((state) => state.unReadCount);
  const unHandleFriendApplicationCount = useContactStore(
    (state) => state.unHandleFriendApplicationCount,
  );
  const unHandleGroupApplicationCount = useContactStore(
    (state) => state.unHandleGroupApplicationCount,
  );

  const tryNavigate = () => {
    if (isActive) return;
    // TODO 从其他页面跳转回到chat页面时，保持回话（如果存在）
    navigator.push(path);
  };

  const getBadge = () => {
    if (path === "/chat") {
      return unReadCount;
    }
    if (path === "/contact") {
      return unHandleFriendApplicationCount + unHandleGroupApplicationCount;
    }
    return 0;
  };

  return (
    <Badge size="small" count={getBadge()}>
      <div
        className={clsx(
          "mb-3 flex h-[52px] w-12 cursor-pointer flex-col items-center justify-center rounded-md",
          { "bg-[#e9e9eb]": isActive },
        )}
        onClick={tryNavigate}
      >
        <img width={20} src={isActive ? icon_active : icon} alt="" />
        <div className="mt-1 text-xs text-gray-500">{title}</div>
      </div>
    </Badge>
  );
};

const profileMenuList = [
  {
    title: "我的信息",
    gap: true,
    idx: 0,
  },
  {
    title: "账号设置",
    gap: true,
    idx: 1,
  },
  {
    title: "关于我们",
    gap: false,
    idx: 2,
  },
  {
    title: "退出登录",
    gap: false,
    idx: 3,
  },
];

const LeftNavBar = memo(() => {
  const aboutRef = useRef<OverlayVisibleHandle>(null);
  const personalSettingsRef = useRef<OverlayVisibleHandle>(null);
  const [showProfile, setShowProfile] = useState(false);
  const selfInfo = useUserStore((state) => state.selfInfo);
  const userLogout = useUserStore((state) => state.userLogout);
  const updateSelfInfo = useUserStore((state) => state.updateSelfInfo);

  const profileMenuClick = (idx: number) => {
    switch (idx) {
      case 0:
        emitter.emit("OPEN_USER_CARD", { isSelf: true });
        break;
      case 1:
        personalSettingsRef.current?.openOverlay();
        break;
      case 2:
        aboutRef.current?.openOverlay();
        break;
      case 3:
        tryLogout();
        break;
      default:
        break;
    }
    setShowProfile(false);
  };

  const tryLogout = () => {
    modal.confirm({
      title: "退出登录",
      content: "确认退出登录当前账号吗？",
      onOk: async () => {
        try {
          await userLogout();
        } catch (error) {
          feedbackToast({ error });
        }
      },
    });
  };

  const customUpload = async ({ file }: { file: File }) => {
    try {
      const {
        data: { url },
      } = await IMSDK.uploadFile({
        name: file.name,
        contentType: getFileType(file.name),
        uuid: uuidV4(),
        file,
      });
      const newInfo = {
        faceURL: url,
      };
      await updateBusinessUserInfo(newInfo);
      updateSelfInfo(newInfo);
    } catch (error) {
      feedbackToast({ error: "修改头像失败！" });
    }
  };

  const ProfileContent = (
    <div className="w-72 px-2.5 pb-3 pt-5.5">
      <div className="mb-4.5 ml-3 flex items-center">
        <Upload
          accept="image/*"
          showUploadList={false}
          customRequest={customUpload as any}
        >
          <div className={styles["avatar-wrapper"]}>
            <OIMAvatar src={selfInfo.faceURL} text={selfInfo.nickname} />
            <div className={styles["mask"]}>
              <img src={change_avatar} width={19} alt="" />
            </div>
          </div>
        </Upload>
        <div className="flex-1 overflow-hidden">
          <div className="mb-1 text-base font-medium">{selfInfo.nickname}</div>
        </div>
      </div>
      {profileMenuList.map((menu) => (
        <div key={menu.idx}>
          <div
            className="flex cursor-pointer items-center justify-between rounded-md px-3 py-4 hover:bg-[var(--primary-active)]"
            onClick={() => profileMenuClick(menu.idx)}
          >
            <div>{menu.title}</div>
            <RightOutlined rev={undefined} />
          </div>
          {menu.gap && (
            <div className="px-3">
              <Divider className="my-1.5 border-[var(--gap-text)]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Sider
      className="no-mobile border-r border-gray-200 !bg-[#F4F4F4] dark:border-gray-800 dark:!bg-[#141414]"
      width={60}
      theme="light"
    >
      <div className="mt-6 flex flex-col items-center">
        <Popover
          content={ProfileContent}
          trigger="click"
          placement="rightBottom"
          overlayClassName="profile-popover"
          title={null}
          arrow={false}
          open={showProfile}
          onOpenChange={(vis) => setShowProfile(vis)}
        >
          <OIMAvatar
            className="mb-6 cursor-pointer"
            src={selfInfo.faceURL}
            text={selfInfo.nickname}
          />
        </Popover>

        {NavList.map((nav) => (
          <NavItem nav={nav} key={nav.path} />
        ))}
      </div>
      <PersonalSettings ref={personalSettingsRef} />
      <About ref={aboutRef} />
    </Sider>
  );
});

export default LeftNavBar;
