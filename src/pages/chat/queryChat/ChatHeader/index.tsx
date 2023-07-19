import { Layout, Tooltip } from "antd";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import group_member from "@/assets/images/chatHeader/group_member.png";
import launch_group from "@/assets/images/chatHeader/launch_group.png";
import settings from "@/assets/images/chatHeader/settings.png";
import OIMAvatar from "@/components/OIMAvatar";
import { OverlayVisibleHandle } from "@/hooks/useOverlayVisible";
import { useConversationStore } from "@/store";
import emitter from "@/utils/events";
import { getIsOnline, isGroupSession } from "@/utils/imCommon";
import { SessionType } from "@/utils/open-im-sdk-wasm/types/enum";

import GroupSetting from "../GroupSetting";
import SingleSetting from "../SingleSetting";
import styles from "./chat-header.module.scss";

const menuList = [
  {
    title: "创建群聊",
    icon: launch_group,
    idx: 3,
  },
  {
    title: "邀请",
    icon: launch_group,
    idx: 4,
  },
  {
    title: "设置",
    icon: settings,
    idx: 5,
  },
];

const ChatHeader = () => {
  const singleSettingRef = useRef<OverlayVisibleHandle>(null);
  const groupSettingRef = useRef<OverlayVisibleHandle>(null);

  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );
  const currentGroupInfo = useConversationStore((state) => state.currentGroupInfo);
  const inGroup = useConversationStore((state) =>
    Boolean(state.currentMemberInGroup?.groupID),
  );

  const menuClick = (idx: number) => {
    switch (idx) {
      case 3:
      case 4:
        emitter.emit("OPEN_CHOOSE_MODAL", {
          type: isSingle ? "CRATE_GROUP" : "INVITE_TO_GROUP",
          extraData: isSingle
            ? [{ ...currentConversation }]
            : currentConversation?.groupID,
        });
        break;
      case 5:
        if (isGroupSession(currentConversation?.conversationType)) {
          groupSettingRef.current?.openOverlay();
        } else {
          singleSettingRef.current?.openOverlay();
        }
        break;
      default:
        break;
    }
  };

  const isNotification =
    currentConversation?.conversationType === SessionType.Notification;
  const isSingle = currentConversation?.conversationType === SessionType.Single;

  return (
    <Layout.Header className="relative border-b border-b-[var(--gap-text)] !bg-white !px-3">
      <div className="flex h-full items-center justify-between leading-none">
        <div className="flex items-center">
          <OIMAvatar
            src={currentConversation?.faceURL}
            text={currentConversation?.showName}
            isgroup={Boolean(currentConversation?.groupID)}
            isnotification={isNotification}
          />
          <div className="ml-3 flex h-10.5 flex-col justify-between">
            <div className="text-base font-semibold">
              {currentConversation?.showName}
            </div>
            {isSingle ? (
              <OnlineOrTypingStatus userID={currentConversation?.userID} />
            ) : (
              <div className="flex items-center text-xs text-[var(--sub-text)]">
                <img width={20} src={group_member} alt="member" />
                <span>{currentGroupInfo?.memberCount}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mr-5 flex">
          {menuList.map((menu) => {
            if (menu.idx === 4 && (isSingle || (!inGroup && !isSingle))) {
              return null;
            }
            if (menu.idx === 3 && !isSingle) {
              return null;
            }

            return (
              <Tooltip title={menu.title} key={menu.idx}>
                <img
                  className="ml-5 cursor-pointer"
                  width={20}
                  src={menu.icon}
                  alt=""
                  onClick={() => menuClick(menu.idx)}
                />
              </Tooltip>
            );
          })}
        </div>
      </div>
      <SingleSetting ref={singleSettingRef} />
      <GroupSetting ref={groupSettingRef} />
    </Layout.Header>
  );
};

export default ChatHeader;

const OnlineOrTypingStatus = ({ userID }: { userID: string }) => {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    getIsOnline([userID]).then((val) => setOnline(val));
  }, [userID]);

  return (
    <div className="flex items-center">
      <i
        className={clsx(
          "mr-1.5 inline-block h-[6px] w-[6px] rounded-full bg-[#2ddd73]",
          {
            "bg-[#999]": !online,
          },
        )}
      />
      <span className="text-xs text-[var(--sub-text)]">{online ? "在线" : "离线"}</span>
    </div>
  );
};
