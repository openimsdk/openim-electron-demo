import { CbEvents } from "@openim/wasm-client-sdk";
import { OnlineState, Platform, SessionType } from "@openim/wasm-client-sdk";
import {
  ConversationInputStatus,
  UserOnlineState,
  WSEvent,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { useRequest } from "ahooks";
import { Layout, Tooltip } from "antd";
import clsx from "clsx";
import i18n, { t } from "i18next";
import { memo, useEffect, useRef, useState } from "react";

import group_member from "@/assets/images/chatHeader/group_member.png";
import launch_group from "@/assets/images/chatHeader/launch_group.png";
import settings from "@/assets/images/chatHeader/settings.png";
import OIMAvatar from "@/components/OIMAvatar";
import { OverlayVisibleHandle } from "@/hooks/useOverlayVisible";
import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore, useUserStore } from "@/store";
import { emit } from "@/utils/events";

import GroupSetting from "../GroupSetting";
import SingleSetting from "../SingleSetting";
import styles from "./chat-header.module.scss";

const menuList = [
  {
    title: t("placeholder.createGroup"),
    icon: launch_group,
    idx: 0,
  },
  {
    title: t("placeholder.invitation"),
    icon: launch_group,
    idx: 1,
  },
  {
    title: t("placeholder.setting"),
    icon: settings,
    idx: 2,
  },
];

i18n.on("languageChanged", () => {
  menuList[0].title = t("placeholder.createGroup");
  menuList[1].title = t("placeholder.invitation");
  menuList[2].title = t("placeholder.setting");
});

const ChatHeader = ({ isBlackUser }: { isBlackUser: boolean }) => {
  const singleSettingRef = useRef<OverlayVisibleHandle>(null);
  const groupSettingRef = useRef<OverlayVisibleHandle>(null);

  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );
  const currentGroupInfo = useConversationStore((state) => state.currentGroupInfo);
  const currentUserIsInGroup = useConversationStore((state) =>
    Boolean(state.currentMemberInGroup?.userID),
  );
  const inGroup = useConversationStore((state) =>
    Boolean(state.currentMemberInGroup?.groupID),
  );

  // locale re render
  useUserStore((state) => state.appSettings.locale);

  useEffect(() => {
    if (singleSettingRef.current?.isOverlayOpen) {
      singleSettingRef.current?.closeOverlay();
    }
    if (groupSettingRef.current?.isOverlayOpen) {
      groupSettingRef.current?.closeOverlay();
    }
  }, [currentConversation?.conversationID]);

  const menuClick = (idx: number) => {
    switch (idx) {
      case 0:
      case 1:
        emit("OPEN_CHOOSE_MODAL", {
          type: isSingleSession ? "CRATE_GROUP" : "INVITE_TO_GROUP",
          extraData: isSingleSession
            ? [{ ...currentConversation }]
            : currentConversation?.groupID,
        });
        break;
      case 2:
        if (isGroupSession) {
          groupSettingRef.current?.openOverlay();
        } else {
          singleSettingRef.current?.openOverlay();
        }
        break;
      default:
        break;
    }
  };

  const showCard = () => {
    if (isSingleSession || isNotificationSession) {
      window.userClick(currentConversation?.userID);
      return;
    }
    if (currentGroupInfo) {
      emit("OPEN_GROUP_CARD", currentGroupInfo);
    }
  };

  const isNotificationSession =
    currentConversation?.conversationType === SessionType.Notification;
  const isSingleSession = currentConversation?.conversationType === SessionType.Single;
  const isGroupSession = currentConversation?.conversationType === SessionType.Group;

  return (
    <Layout.Header className="relative border-b border-b-[var(--gap-text)] !bg-white !px-3">
      <div className="flex h-full items-center leading-none">
        <div className="flex flex-1 items-center overflow-hidden">
          <OIMAvatar
            src={currentConversation?.faceURL}
            text={currentConversation?.showName}
            isgroup={Boolean(currentConversation?.groupID)}
            isnotification={isNotificationSession}
            onClick={showCard}
          />
          <div
            className={clsx(
              "ml-3 flex !h-10.5 flex-1 flex-col justify-between overflow-hidden",
              isNotificationSession && "!justify-center",
            )}
          >
            <div className="truncate text-base font-semibold">
              {currentConversation?.showName}
            </div>
            {isSingleSession && (
              <OnlineOrTypingStatus userID={currentConversation?.userID} />
            )}
            {isGroupSession && currentUserIsInGroup && (
              <div className="flex items-center text-xs text-[var(--sub-text)]">
                <img width={20} src={group_member} alt="member" />
                <span>{currentGroupInfo?.memberCount}</span>
              </div>
            )}
          </div>
        </div>

        {!isNotificationSession && (
          <div className="mr-5 flex">
            {menuList.map((menu) => {
              if (
                menu.idx === 1 &&
                (isSingleSession || (!inGroup && !isSingleSession))
              ) {
                return null;
              }
              if (menu.idx === 0 && (!isSingleSession || isBlackUser)) {
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
        )}
      </div>
      <SingleSetting ref={singleSettingRef} />
      <GroupSetting ref={groupSettingRef} />
    </Layout.Header>
  );
};

export default memo(ChatHeader);

const OnlineOrTypingStatus = ({ userID }: { userID: string }) => {
  const [typing, setTyping] = useState(false);
  const [onlineState, setOnlineState] = useState<UserOnlineState>();

  const { loading, cancel: cancelSubscribe } = useRequest(
    () => IMSDK.subscribeUsersStatus([userID]),
    {
      refreshDeps: [userID],
      onSuccess: ({ data }) => setOnlineState(data[0]),
    },
  );

  useEffect(() => {
    const userStatusChangeHandler = ({ data }: WSEvent<UserOnlineState>) => {
      if (data.userID === userID) {
        setOnlineState(data);
      }
    };
    IMSDK.on(CbEvents.OnUserStatusChanged, userStatusChangeHandler);
    return () => {
      IMSDK.off(CbEvents.OnUserStatusChanged, userStatusChangeHandler);
      IMSDK.unsubscribeUsersStatus([userID]);
      cancelSubscribe();
      setTyping(false);
    };
  }, [userID]);

  useEffect(() => {
    const conversationUserInputStatusChangedHandler = ({
      data,
    }: WSEvent<ConversationInputStatus>) => {
      const tmpConversation = useConversationStore.getState().currentConversation;
      if (
        data.conversationID !== tmpConversation?.conversationID ||
        data.userID !== tmpConversation.userID
      )
        return;

      setTyping(Boolean(data.platformIDs.length));
    };
    IMSDK.on(
      CbEvents.OnConversationUserInputStatusChanged,
      conversationUserInputStatusChangedHandler,
    );
  }, []);

  return (
    <div className="flex items-center">
      {typing ? (
        <p className="text-xs text-[var(--sub-text)]">
          {t("placeholder.typing")} <span className={styles["dot-1"]}>.</span>
          <span className={styles["dot-2"]}>.</span>
          <span className={styles["dot-3"]}>.</span>
        </p>
      ) : (
        !loading && (
          <>
            <i
              className={clsx(
                "mr-1.5 inline-block h-[6px] w-[6px] rounded-full bg-[#2ddd73]",
                {
                  "bg-[#999]": onlineState?.status === OnlineState.Offline,
                },
              )}
            />
            <span className="text-xs text-[var(--sub-text)]">
              {platformToDetails(onlineState)}
            </span>
          </>
        )
      )}
    </div>
  );
};

const platformMap: Record<Platform, string> = {
  1: "iOS",
  2: "Android",
  3: "Windows",
  4: "MacOSX",
  5: "Web",
  // @ts-ignore
  6: "MiniProgram",
  7: "Linux",
  8: "AndroidPad",
  9: "iPad",
};

const platformToDetails = (state?: UserOnlineState) => {
  if (!state || state.status === OnlineState.Offline) return t("placeholder.offLine");
  let string = "";
  state.platformIDs?.map((platform) => (string += `${platformMap[platform]}/`));
  return `${string.slice(0, -1)}${t("placeholder.online")}`;
};
