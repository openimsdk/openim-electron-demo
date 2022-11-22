import { t } from "i18next";
import { getSDK } from "./open_im_sdk_wasm";
import { ConversationItem, MessageItem } from "./open_im_sdk_wasm/types/entity";
import { MessageType } from "./open_im_sdk_wasm/types/enum";



export const im = getSDK('./openIM.wasm')

//utils
export const isSingleCve = (cve: ConversationItem) => {
  return cve.userID !== "" && cve.groupID === "";
};

export const parseMessageType = (pmsg: MessageItem, curUid?: string): string => {
  const isSelf = (id: string) => id === curUid;

  switch (pmsg.contentType) {
    case MessageType.TEXTMESSAGE:
      return pmsg.content;
    case MessageType.ATTEXTMESSAGE:
      return pmsg.atElem.text;
    case MessageType.PICTUREMESSAGE:
      return t("PictureMessage");
    case MessageType.VIDEOMESSAGE:
      return t("VideoMessage");
    case MessageType.VOICEMESSAGE:
      return t("VoiceMessage");
    case MessageType.LOCATIONMESSAGE:
      return t("LocationMessage");
    case MessageType.CARDMESSAGE:
      return t("CardMessage");
    case MessageType.MERGERMESSAGE:
      return t("MergeMessage");
    case MessageType.FILEMESSAGE:
      return t("FileMessage");
    case MessageType.REVOKEMESSAGE:
    case MessageType.ADVANCEREVOKEMESSAGE:
      return `${isSelf(pmsg.sendID) ? t("You") : pmsg.senderNickname}${t("RevokeMessage")}`;
    case MessageType.CUSTOMMESSAGE:
      return t("CustomMessage");
    case MessageType.QUOTEMESSAGE:
      return t("QuoteMessage");
    case MessageType.FRIENDADDED:
      return t("AlreadyFriend");
    case MessageType.MEMBERENTER:
      const enterDetails = JSON.parse(pmsg.notificationElem.detail);
      const enterUser = enterDetails.entrantUser;
      return `${isSelf(enterUser.userID) ? t("You") : enterUser.nickname}${t("JoinedGroup")}`;
    case MessageType.GROUPCREATED:
      const groupCreatedDetail = JSON.parse(pmsg.notificationElem.detail);
      const groupCreatedUser = groupCreatedDetail.opUser;
      return `${isSelf(groupCreatedUser.userID) ? t("You") : groupCreatedUser.nickname}${t("GroupCreated")}`;
    case MessageType.MEMBERINVITED:
      const inviteDetails = JSON.parse(pmsg.notificationElem.detail);
      const inviteOpUser = inviteDetails.opUser;
      const invitedUserList = inviteDetails.invitedUserList ?? [];
      let inviteStr = "";
      invitedUserList.forEach((user: any) => (inviteStr += (isSelf(user.userID) ? t("You") : user.nickname) + " "));
      return `${isSelf(inviteOpUser.userID) ? t("You") : inviteOpUser.nickname}${t("Invited")}${inviteStr}${t("IntoGroup")}`;
    case MessageType.MEMBERKICKED:
      const kickDetails = JSON.parse(pmsg.notificationElem.detail);
      const kickOpUser = kickDetails.opUser;
      const kickdUserList = kickDetails.kickedUserList ?? [];
      let kickStr = "";
      kickdUserList.forEach((user: any) => (kickStr += (isSelf(user.userID) ? t("You") : user.nickname) + " "));
      return `${isSelf(kickOpUser.userID) ? t("You") : kickOpUser.nickname}${t("Kicked")}${kickStr}${t("OutGroup")}`;
    case MessageType.MEMBERQUIT:
      const quitDetails = JSON.parse(pmsg.notificationElem.detail);
      const quitUser = quitDetails.quitUser;
      return `${isSelf(quitUser.userID) ? t("You") : quitUser.nickname}${t("QuitedGroup")}`;
    case MessageType.GROUPINFOUPDATED:
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

// export const createNotification = (message: MessageItem, click?: (id: string, type: SessionType) => void, tag?: string) => {
//   if (Notification && document.hidden) {
//     const title = message.contentType === MessageType.FRIENDADDED ? t("FriendNotice") : message.senderNickname;
//     const notification = new Notification(title, {
//       dir: "auto",
//       tag: tag ?? message.groupID ?? message.sendID,
//       renotify: true,
//       icon: message.senderFaceUrl,
//       body: parseMessageType(message),
//       requireInteraction: true,
//     });
//     const id = message.sessionType === SessionType.SINGLECVE ? (message.contentType === MessageType.FRIENDADDED ? message.recvID : message.sendID) : message.groupID;
//     notification.onclick = () => {
//       click && click(id, message.sessionType);
//       notification.close();
//     };
//   }
// };

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
