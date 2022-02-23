// import { OpenIMSDK } from 'open-im-sdk'
import { t } from "i18next";
import { messageTypes, SessionType, tipsTypes } from "../constants/messageContentType";
import { OpenIMSDK } from "./open_im_sdk";
import { ConversationItem, MessageItem } from "./open_im_sdk/types";

export const im = new OpenIMSDK();

//utils
export const isSingleCve = (cve: ConversationItem) => {
  return cve.userID !== "" && cve.groupID === "";
};

export const parseMessageType = (pmsg: MessageItem, curUid?: string): string => {
  const isSelf = (id: string) => id === curUid;

  switch (pmsg.contentType) {
    case messageTypes.TEXTMESSAGE:
      return pmsg.content;
    case messageTypes.ATTEXTMESSAGE:
      return pmsg.atElem.text;
    case messageTypes.PICTUREMESSAGE:
      return t("PictureMessage");
    case messageTypes.VIDEOMESSAGE:
      return t("VideoMessage");
    case messageTypes.VOICEMESSAGE:
      return t("VoiceMessage");
    case messageTypes.LOCATIONMESSAGE:
      return t("LocationMessage");
    case messageTypes.CARDMESSAGE:
      return t("CardMessage");
    case messageTypes.MERGERMESSAGE:
      return t("MergeMessage");
    case messageTypes.FILEMESSAGE:
      return t("FileMessage");
    case messageTypes.REVOKEMESSAGE:
      return `${isSelf(pmsg.sendID) ? t("You") : pmsg.senderNickname}${t("RevokeMessage")}`;
    case messageTypes.CUSTOMMESSAGE:
      return t("CustomMessage");
    case messageTypes.QUOTEMESSAGE:
      return t("QuoteMessage");
    case tipsTypes.FRIENDADDED:
      return t("AlreadyFriend");
    case tipsTypes.MEMBERENTER:
      const enterDetails = JSON.parse(pmsg.notificationElem.detail);
      const enterUser = enterDetails.entrantUser;
      return `${isSelf(enterUser.userID) ? t("You") : enterUser.nickname}${t("JoinedGroup")}`;
    case tipsTypes.GROUPCREATED:
      const groupCreatedDetail = JSON.parse(pmsg.notificationElem.detail);
      const groupCreatedUser = groupCreatedDetail.opUser;
      return `${isSelf(groupCreatedUser.userID) ? t("You") : groupCreatedUser.nickname}${t("GroupCreated")}`;
    case tipsTypes.MEMBERINVITED:
      const inviteDetails = JSON.parse(pmsg.notificationElem.detail);
      const inviteOpUser = inviteDetails.opUser;
      const invitedUserList = inviteDetails.invitedUserList ?? [];
      let inviteStr = "";
      invitedUserList.forEach((user: any) => (inviteStr += (isSelf(user.userID) ? t("You") : user.nickname) + " "));
      return `${isSelf(inviteOpUser.userID) ? t("You") : inviteOpUser.nickname}${t("Invited")}${inviteStr}${t("IntoGroup")}`;
    case tipsTypes.MEMBERKICKED:
      const kickDetails = JSON.parse(pmsg.notificationElem.detail);
      const kickOpUser = kickDetails.opUser;
      const kickdUserList = kickDetails.kickedUserList ?? [];
      let kickStr = "";
      kickdUserList.forEach((user: any) => (kickStr += (isSelf(user.userID) ? t("You") : user.nickname) + " "));
      return `${isSelf(kickOpUser.userID) ? t("You") : kickOpUser.nickname}${t("Kicked")}${kickStr}${t("OutGroup")}`;
    case tipsTypes.MEMBERQUIT:
      const quitDetails = JSON.parse(pmsg.notificationElem.detail);
      const quitUser = quitDetails.quitUser;
      return `${isSelf(quitUser.userID) ? t("You") : quitUser.nickname}${t("QuitedGroup")}`;
    case tipsTypes.GROUPINFOUPDATED:
      const groupUpdateDetail = JSON.parse(pmsg.notificationElem.detail);
      const groupUpdateUser = groupUpdateDetail.opUser;
      return `${isSelf(groupUpdateUser.userID) ? t("You") : groupUpdateUser.nickname}${t("ModifiedGroup")}`;
    default:
      return pmsg.notificationElem.defaultTips;
  }
};

export const getNotification = (cb?: () => void) => {
  if (Notification && (Notification.permission === "default" || Notification.permission === "denied")) {
    Notification.requestPermission((permission) => {
      if (permission === "granted") {
        cb && cb();
      }
    });
  } else {
    cb && cb();
  }
};

export const createNotification = (message: MessageItem, click?: (id: string, type: SessionType) => void, tag?: string) => {
  if (Notification && document.hidden) {
    const title = message.contentType === tipsTypes.FRIENDADDED ? t("FriendNotice") : message.senderNickname;
    const notification = new Notification(title, {
      dir: "auto",
      tag: tag ?? (message.groupID === "" ? message.sendID : message.groupID),
      renotify: true,
      icon: message.senderFaceUrl,
      body: parseMessageType(message),
      requireInteraction: true,
    });
    const id = message.sessionType === SessionType.SINGLECVE ? (message.contentType === tipsTypes.FRIENDADDED ? message.recvID : message.sendID) : message.groupID;
    notification.onclick = () => {
      click && click(id, message.sessionType);
      notification.close();
    };
  }
};

export const cveSort = (cveList: ConversationItem[]) => {
  const arr:string[] = [];
  const filterArr = cveList.filter(c=>!arr.includes(c.conversationID)&&arr.push(c.conversationID))
  filterArr.sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      const aCompare = a.draftTextTime! > a.latestMsgSendTime! ? a.draftTextTime! : a.latestMsgSendTime!;
      const bCompare = b.draftTextTime! > b.latestMsgSendTime! ? b.draftTextTime! : b.latestMsgSendTime!;
      if (aCompare > bCompare) {
        return -1;
      } else if (aCompare < bCompare) {
        return 1;
      } else {
        return 0;
      }
    } else if (a.isPinned && !b.isPinned) {
      return -1;
    } else {
      return 1;
    }
  });
  return filterArr;
};
