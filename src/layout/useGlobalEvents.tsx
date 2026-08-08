import { LogLevel, SdkEvent } from "@openim/wasm-client-sdk";
import { MessageType, SessionType } from "@openim/wasm-client-sdk";
import {
  BlackUserItem,
  ConversationItem,
  FriendApplicationItem,
  FriendUserItem,
  GroupApplicationItem,
  GroupItem,
  GroupMemberItem,
  MessageItem,
  RevokedInfo,
  SdkEventEnvelope,
  SdkResponse,
  SelfUserInfo,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { t } from "i18next";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { CustomType } from "@/constants";
import {
  pushNewMessage,
  updateOneMessage,
} from "@/pages/chat/queryChat/useHistoryMessageList";
import { useConversationStore, useUserStore } from "@/store";
import { useContactStore } from "@/store/contact";
import { feedbackToast } from "@/utils/common";
import { initStore } from "@/utils/imCommon";
import { clearIMProfile, getIMToken, getIMUserID } from "@/utils/storage";

import { IMSDK } from "./MainContentWrap";

export function useGlobalEvent() {
  const navigate = useNavigate();
  const resume = useRef(false);

  // user
  const updateSyncState = useUserStore((state) => state.updateSyncState);
  const updateProgressState = useUserStore((state) => state.updateProgressState);
  const updateReinstallState = useUserStore((state) => state.updateReinstallState);
  const updateIsLogining = useUserStore((state) => state.updateIsLogining);
  const updateConnectState = useUserStore((state) => state.updateConnectState);
  const updateSelfInfo = useUserStore((state) => state.updateSelfInfo);
  const userLogout = useUserStore((state) => state.userLogout);
  // conversation
  const updateConversationList = useConversationStore(
    (state) => state.updateConversationList,
  );
  const updateUnReadCount = useConversationStore((state) => state.updateUnReadCount);
  const updateCurrentGroupInfo = useConversationStore(
    (state) => state.updateCurrentGroupInfo,
  );
  const getCurrentGroupInfoByReq = useConversationStore(
    (state) => state.getCurrentGroupInfoByReq,
  );
  const setCurrentMemberInGroup = useConversationStore(
    (state) => state.setCurrentMemberInGroup,
  );
  const getCurrentMemberInGroupByReq = useConversationStore(
    (state) => state.getCurrentMemberInGroupByReq,
  );
  const tryUpdateCurrentMemberInGroup = useConversationStore(
    (state) => state.tryUpdateCurrentMemberInGroup,
  );
  const getConversationListByReq = useConversationStore(
    (state) => state.getConversationListByReq,
  );
  const getUnReadCountByReq = useConversationStore(
    (state) => state.getUnReadCountByReq,
  );
  // contact
  const getFriendListByReq = useContactStore((state) => state.getFriendListByReq);
  const getGroupListByReq = useContactStore((state) => state.getGroupListByReq);
  const updateFriend = useContactStore((state) => state.updateFriend);
  const pushNewFriend = useContactStore((state) => state.pushNewFriend);
  const updateBlack = useContactStore((state) => state.updateBlack);
  const pushNewBlack = useContactStore((state) => state.pushNewBlack);
  const updateGroup = useContactStore((state) => state.updateGroup);
  const pushNewGroup = useContactStore((state) => state.pushNewGroup);
  const updateRecvFriendApplication = useContactStore(
    (state) => state.updateRecvFriendApplication,
  );
  const updateSendFriendApplication = useContactStore(
    (state) => state.updateSendFriendApplication,
  );
  const updateRecvGroupApplication = useContactStore(
    (state) => state.updateRecvGroupApplication,
  );
  const updateSendGroupApplication = useContactStore(
    (state) => state.updateSendGroupApplication,
  );

  useEffect(() => {
    loginCheck();
    setIMListener();
    setIpcListener();

    window.addEventListener("online", () => {
      IMSDK.networkStatusChanged();
    });
    window.addEventListener("offline", () => {
      IMSDK.networkStatusChanged();
    });
    return () => {
      disposeIMListener();
    };
  }, []);

  const loginCheck = async () => {
    const IMToken = (await getIMToken()) as string;
    const IMUserID = (await getIMUserID()) as string;
    if (!IMToken || !IMUserID) {
      clearIMProfile();
      navigate("/login");
      return;
    }
    tryLogin();
  };

  const tryLogin = async () => {
    updateIsLogining(true);
    const IMToken = (await getIMToken()) as string;
    const IMUserID = (await getIMUserID()) as string;
    try {
      const apiAddr = import.meta.env.VITE_API_URL;
      const wsAddr = import.meta.env.VITE_WS_URL;
      if (window.electronAPI) {
        await IMSDK.initSDK({
          platformID: window.electronAPI?.getPlatform() ?? 5,
          apiAddr,
          wsAddr,
          dataDir: window.electronAPI.getDataPath("sdkResources") || "./",
          logFilePath: window.electronAPI.getDataPath("logsPath") || "./",
          logLevel: LogLevel.Debug,
          isLogStandardOutput: false,
          systemType: "electron",
        });
        await IMSDK.login({
          userID: IMUserID,
          token: IMToken,
        });
      } else {
        await IMSDK.login({
          userID: IMUserID,
          token: IMToken,
          platformID: 5,
          apiAddr,
          wsAddr,
          logLevel: LogLevel.Debug,
        });
      }
      initStore();
    } catch (error) {
      console.error(error);
      if ((error as SdkResponse).errCode !== 10102) {
        navigate("/login");
      }
    }
    updateIsLogining(false);
  };

  const setIMListener = () => {
    // account
    IMSDK.on(SdkEvent.OnSelfInfoUpdated, selfUpdateHandler);
    IMSDK.on(SdkEvent.OnConnecting, connectingHandler);
    IMSDK.on(SdkEvent.OnConnectFailed, connectFailedHandler);
    IMSDK.on(SdkEvent.OnConnectSuccess, connectSuccessHandler);
    IMSDK.on(SdkEvent.OnKickedOffline, kickHandler);
    IMSDK.on(SdkEvent.OnUserTokenExpired, expiredHandler);
    IMSDK.on(SdkEvent.OnUserTokenInvalid, expiredHandler);
    // sync
    IMSDK.on(SdkEvent.OnSyncServerStart, syncStartHandler);
    IMSDK.on(SdkEvent.OnSyncServerProgress, syncProgressHandler);
    IMSDK.on(SdkEvent.OnSyncServerFinish, syncFinishHandler);
    IMSDK.on(SdkEvent.OnSyncServerFailed, syncFailedHandler);
    // message
    IMSDK.on(SdkEvent.OnRecvNewMessages, newMessageHandler);
    IMSDK.on(SdkEvent.OnNewRecvMessageRevoked, revokedMessageHandler);
    // conversation
    IMSDK.on(SdkEvent.OnConversationChanged, conversationChnageHandler);
    IMSDK.on(SdkEvent.OnNewConversation, newConversationHandler);
    IMSDK.on(SdkEvent.OnTotalUnreadMessageCountChanged, totalUnreadChangeHandler);
    // friend
    IMSDK.on(SdkEvent.OnFriendInfoChanged, friednInfoChangeHandler);
    IMSDK.on(SdkEvent.OnFriendAdded, friednAddedHandler);
    IMSDK.on(SdkEvent.OnFriendDeleted, friednDeletedHandler);
    // blacklist
    IMSDK.on(SdkEvent.OnBlackAdded, blackAddedHandler);
    IMSDK.on(SdkEvent.OnBlackDeleted, blackDeletedHandler);
    // group
    IMSDK.on(SdkEvent.OnJoinedGroupAdded, joinedGroupAddedHandler);
    IMSDK.on(SdkEvent.OnJoinedGroupDeleted, joinedGroupDeletedHandler);
    IMSDK.on(SdkEvent.OnGroupDismissed, joinedGroupDismissHandler);
    IMSDK.on(SdkEvent.OnGroupInfoChanged, groupInfoChangedHandler);
    IMSDK.on(SdkEvent.OnGroupMemberAdded, groupMemberAddedHandler);
    IMSDK.on(SdkEvent.OnGroupMemberDeleted, groupMemberDeletedHandler);
    IMSDK.on(SdkEvent.OnGroupMemberInfoChanged, groupMemberInfoChangedHandler);
    // application
    IMSDK.on(SdkEvent.OnFriendApplicationAdded, friendApplicationProcessedHandler);
    IMSDK.on(SdkEvent.OnFriendApplicationAccepted, friendApplicationProcessedHandler);
    IMSDK.on(SdkEvent.OnFriendApplicationRejected, friendApplicationProcessedHandler);
    IMSDK.on(SdkEvent.OnGroupApplicationAdded, groupApplicationProcessedHandler);
    IMSDK.on(SdkEvent.OnGroupApplicationAccepted, groupApplicationProcessedHandler);
    IMSDK.on(SdkEvent.OnGroupApplicationRejected, groupApplicationProcessedHandler);
  };

  const selfUpdateHandler = ({ data }: SdkEventEnvelope<SelfUserInfo>) => {
    updateSelfInfo(data);
  };
  const connectingHandler = () => {
    updateConnectState("loading");
    console.log("connecting...");
  };
  const connectFailedHandler = ({ errCode, errMsg }: SdkEventEnvelope) => {
    updateConnectState("failed");
    console.error("connectFailedHandler", errCode, errMsg);

    if (errCode === 705) {
      tryOut(t("toast.loginExpiration"));
    }
  };
  const connectSuccessHandler = () => {
    updateConnectState("success");
    console.log("connect success...");
  };
  const kickHandler = () => tryOut(t("toast.accountKicked"));
  const expiredHandler = () => tryOut(t("toast.loginExpiration"));

  const tryOut = (msg: string) =>
    feedbackToast({
      msg,
      error: msg,
      onClose: () => {
        userLogout(true);
      },
    });

  // sync
  const syncStartHandler = ({ data }: SdkEventEnvelope<boolean>) => {
    updateSyncState("loading");
    updateReinstallState(data);
  };
  const syncProgressHandler = ({ data }: SdkEventEnvelope<number>) => {
    updateProgressState(data);
  };
  const syncFinishHandler = () => {
    updateSyncState("success");
    getFriendListByReq();
    getGroupListByReq();
    getConversationListByReq(false);
    getUnReadCountByReq();
  };
  const syncFailedHandler = () => {
    updateSyncState("failed");
    feedbackToast({ msg: t("toast.syncFailed"), error: t("toast.syncFailed") });
  };

  // message
  const newMessageHandler = ({ data }: SdkEventEnvelope<MessageItem[]>) => {
    if (useUserStore.getState().syncState === "loading" || resume.current) {
      return;
    }
    data.map((message) => handleNewMessage(message));
  };

  const revokedMessageHandler = ({ data }: SdkEventEnvelope<RevokedInfo>) => {
    updateOneMessage({
      clientMsgID: data.clientMsgID,
      contentType: MessageType.RevokeMessage,
      notificationElem: {
        detail: JSON.stringify(data),
      },
    } as MessageItem);
  };

  const notPushType = [MessageType.TypingMessage, MessageType.RevokeMessage];

  const handleNewMessage = (newServerMsg: MessageItem) => {
    if (newServerMsg.contentType === MessageType.CustomMessage) {
      const customData = JSON.parse(newServerMsg.customElem!.data);
      if (
        CustomType.CallingInvite <= customData.customType &&
        customData.customType <= CustomType.CallingHungup
      ) {
        return;
      }
    }

    if (!inCurrentConversation(newServerMsg)) return;

    if (!notPushType.includes(newServerMsg.contentType)) {
      pushNewMessage(newServerMsg);
    }
  };

  const inCurrentConversation = (newServerMsg: MessageItem) => {
    switch (newServerMsg.sessionType) {
      case SessionType.Single:
        return (
          newServerMsg.sendID ===
            useConversationStore.getState().currentConversation?.userID ||
          (newServerMsg.sendID === useUserStore.getState().selfInfo.userID &&
            newServerMsg.recvID ===
              useConversationStore.getState().currentConversation?.userID)
        );
      case SessionType.Group:
      case SessionType.WorkingGroup:
        return (
          newServerMsg.groupID ===
          useConversationStore.getState().currentConversation?.groupID
        );
      case SessionType.Notification:
        return (
          newServerMsg.sendID ===
          useConversationStore.getState().currentConversation?.userID
        );
      default:
        return false;
    }
  };

  // conversation
  const conversationChnageHandler = ({
    data,
  }: SdkEventEnvelope<ConversationItem[]>) => {
    updateConversationList(data, "filter");
  };
  const newConversationHandler = ({ data }: SdkEventEnvelope<ConversationItem[]>) => {
    updateConversationList(data, "push");
  };
  const totalUnreadChangeHandler = ({ data }: SdkEventEnvelope<number>) => {
    if (data === useConversationStore.getState().unReadCount) return;
    updateUnReadCount(data);
  };

  // friend
  const friednInfoChangeHandler = ({ data }: SdkEventEnvelope<FriendUserItem>) => {
    updateFriend(data);
  };
  const friednAddedHandler = ({ data }: SdkEventEnvelope<FriendUserItem>) => {
    pushNewFriend(data);
  };
  const friednDeletedHandler = ({ data }: SdkEventEnvelope<FriendUserItem>) => {
    updateFriend(data, true);
  };

  // blacklist
  const blackAddedHandler = ({ data }: SdkEventEnvelope<BlackUserItem>) => {
    pushNewBlack(data);
  };
  const blackDeletedHandler = ({ data }: SdkEventEnvelope<BlackUserItem>) => {
    IMSDK.getSpecifiedFriendsInfo({
      friendUserIDList: [data.userID],
    }).then(({ data }) => {
      if (data.length) {
        pushNewFriend(data[0]);
      }
    });
    updateBlack(data, true);
  };

  // group
  const joinedGroupAddedHandler = ({ data }: SdkEventEnvelope<GroupItem>) => {
    if (data.groupID === useConversationStore.getState().currentConversation?.groupID) {
      updateCurrentGroupInfo(data);
      getCurrentMemberInGroupByReq(data.groupID);
    }
    pushNewGroup(data);
  };
  const joinedGroupDeletedHandler = ({ data }: SdkEventEnvelope<GroupItem>) => {
    if (data.groupID === useConversationStore.getState().currentConversation?.groupID) {
      getCurrentGroupInfoByReq(data.groupID);
      setCurrentMemberInGroup();
    }
    updateGroup(data, true);
  };
  const joinedGroupDismissHandler = ({ data }: SdkEventEnvelope<GroupItem>) => {
    if (data.groupID === useConversationStore.getState().currentConversation?.groupID) {
      getCurrentMemberInGroupByReq(data.groupID);
    }
  };
  const groupInfoChangedHandler = ({ data }: SdkEventEnvelope<GroupItem>) => {
    updateGroup(data);
    if (data.groupID === useConversationStore.getState().currentConversation?.groupID) {
      updateCurrentGroupInfo(data);
    }
  };
  const groupMemberAddedHandler = ({ data }: SdkEventEnvelope<GroupMemberItem>) => {
    if (
      data.groupID === useConversationStore.getState().currentConversation?.groupID &&
      data.userID === useUserStore.getState().selfInfo.userID
    ) {
      getCurrentMemberInGroupByReq(data.groupID);
    }
  };
  const groupMemberDeletedHandler = ({ data }: SdkEventEnvelope<GroupMemberItem>) => {
    if (
      data.groupID === useConversationStore.getState().currentConversation?.groupID &&
      data.userID === useUserStore.getState().selfInfo.userID
    ) {
      getCurrentMemberInGroupByReq(data.groupID);
    }
  };
  const groupMemberInfoChangedHandler = ({
    data,
  }: SdkEventEnvelope<GroupMemberItem>) => {
    if (data.groupID === useConversationStore.getState().currentConversation?.groupID) {
      tryUpdateCurrentMemberInGroup(data);
    }
  };

  //application
  const friendApplicationProcessedHandler = ({
    data,
  }: SdkEventEnvelope<FriendApplicationItem>) => {
    const isRecv = data.toUserID === useUserStore.getState().selfInfo.userID;
    if (isRecv) {
      updateRecvFriendApplication(data);
    } else {
      updateSendFriendApplication(data);
    }
  };
  const groupApplicationProcessedHandler = ({
    data,
  }: SdkEventEnvelope<GroupApplicationItem>) => {
    const isRecv = data.userID !== useUserStore.getState().selfInfo.userID;
    if (isRecv) {
      updateRecvGroupApplication(data);
    } else {
      updateSendGroupApplication(data);
    }
  };

  const disposeIMListener = () => {
    IMSDK.off(SdkEvent.OnSelfInfoUpdated, selfUpdateHandler);
    IMSDK.off(SdkEvent.OnConnecting, connectingHandler);
    IMSDK.off(SdkEvent.OnConnectFailed, connectFailedHandler);
    IMSDK.off(SdkEvent.OnConnectSuccess, connectSuccessHandler);
    IMSDK.off(SdkEvent.OnKickedOffline, kickHandler);
    IMSDK.off(SdkEvent.OnUserTokenExpired, expiredHandler);
    IMSDK.off(SdkEvent.OnUserTokenInvalid, expiredHandler);
    // sync
    IMSDK.off(SdkEvent.OnSyncServerStart, syncStartHandler);
    IMSDK.off(SdkEvent.OnSyncServerProgress, syncProgressHandler);
    IMSDK.off(SdkEvent.OnSyncServerFinish, syncFinishHandler);
    IMSDK.off(SdkEvent.OnSyncServerFailed, syncFailedHandler);
    // message
    IMSDK.off(SdkEvent.OnRecvNewMessages, newMessageHandler);
    IMSDK.off(SdkEvent.OnNewRecvMessageRevoked, revokedMessageHandler);
    // conversation
    IMSDK.off(SdkEvent.OnConversationChanged, conversationChnageHandler);
    IMSDK.off(SdkEvent.OnNewConversation, newConversationHandler);
    IMSDK.off(SdkEvent.OnTotalUnreadMessageCountChanged, totalUnreadChangeHandler);
    // friend
    IMSDK.off(SdkEvent.OnFriendInfoChanged, friednInfoChangeHandler);
    IMSDK.off(SdkEvent.OnFriendAdded, friednAddedHandler);
    IMSDK.off(SdkEvent.OnFriendDeleted, friednDeletedHandler);
    // blacklist
    IMSDK.off(SdkEvent.OnBlackAdded, blackAddedHandler);
    IMSDK.off(SdkEvent.OnBlackDeleted, blackDeletedHandler);
    // group
    IMSDK.off(SdkEvent.OnJoinedGroupAdded, joinedGroupAddedHandler);
    IMSDK.off(SdkEvent.OnJoinedGroupDeleted, joinedGroupDeletedHandler);
    IMSDK.off(SdkEvent.OnGroupDismissed, joinedGroupDismissHandler);
    IMSDK.off(SdkEvent.OnGroupInfoChanged, groupInfoChangedHandler);
    IMSDK.off(SdkEvent.OnGroupMemberAdded, groupMemberAddedHandler);
    IMSDK.off(SdkEvent.OnGroupMemberDeleted, groupMemberDeletedHandler);
    IMSDK.off(SdkEvent.OnGroupMemberInfoChanged, groupMemberInfoChangedHandler);
    // application
    IMSDK.off(SdkEvent.OnFriendApplicationAdded, friendApplicationProcessedHandler);
    IMSDK.off(SdkEvent.OnFriendApplicationAccepted, friendApplicationProcessedHandler);
    IMSDK.off(SdkEvent.OnFriendApplicationRejected, friendApplicationProcessedHandler);
    IMSDK.off(SdkEvent.OnGroupApplicationAdded, groupApplicationProcessedHandler);
    IMSDK.off(SdkEvent.OnGroupApplicationAccepted, groupApplicationProcessedHandler);
    IMSDK.off(SdkEvent.OnGroupApplicationRejected, groupApplicationProcessedHandler);
  };

  const setIpcListener = () => {
    window.electronAPI?.subscribe("appResume", () => {
      if (resume.current) {
        return;
      }
      resume.current = true;
      setTimeout(() => {
        resume.current = false;
      }, 5000);
    });
  };
}
