import { FC, useEffect, useRef, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { tipsTypes } from "../../../constants/messageContentType";
import { RootState } from "../../../store";
import { events, im, isSingleCve } from "../../../utils";
import ScrollView from "../../../components/ScrollView";
import { MUTILMSG, OPENSINGLEMODAL } from "../../../constants/events";
import MsgItem from "./MsgItem/MsgItem";
import { useTranslation } from "react-i18next";
import { ConversationItem, MessageItem, PictureElem } from "../../../utils/open_im_sdk/types";

type ChatContentProps = {
  msgList: MessageItem[];
  imgClick: (el: PictureElem) => void;
  loadMore: (uid?: string, gid?: string, sMsg?: any) => void;
  hasMore: boolean;
  curCve?: ConversationItem;
  loading: boolean;
  merID?: string;
};

const ChatContent: FC<ChatContentProps> = ({ merID, msgList, imgClick, loadMore, hasMore, curCve, loading }) => {
  const [mutilSelect, setMutilSelect] = useState(false);
  const selectValue = (state: RootState) => state.user.selfInfo;
  const selfID = useSelector(selectValue, shallowEqual).userID!;
  const audioRef = useRef<HTMLAudioElement>(null);
  const { t } = useTranslation();

  const tipList = Object.values(tipsTypes);

  useEffect(() => {
    events.on(MUTILMSG, mutilHandler);
    return () => {
      events.off(MUTILMSG, mutilHandler);
    };
  }, []);

  const mutilHandler = (flag: boolean) => {
    setMutilSelect(flag);
  };

  const isSelf = (id: string) => id === selfID;

  const parseTip = (msg: MessageItem): string | JSX.Element => {
    if (msg.contentType === tipsTypes.REVOKEMESSAGE) {
      return (
        <>
          <b onClick={() => window.userClick(msg.sendID)}>{isSelf(msg.sendID) ? t("You") : isSingleCve(curCve!) ? curCve?.showName : msg.senderNickname}</b>
          {t("RevokeMessage")}
        </>
      );
    }
    switch (msg.contentType) {
      case tipsTypes.FRIENDADDED:
        return t("AlreadyFriend");
      case tipsTypes.GROUPCREATED:
        const groupCreatedDetail = JSON.parse(msg.notificationElem.detail);
        const groupCreatedUser = groupCreatedDetail.opUser;
        return (
          <>
            <b onClick={() => window.userClick(groupCreatedUser.userID)}>{isSelf(groupCreatedUser.userID) ? t("You") : groupCreatedUser.nickname}</b>
            {t("GroupCreated")}
          </>
        );
      case tipsTypes.GROUPINFOUPDATED:
        const groupUpdateDetail = JSON.parse(msg.notificationElem.detail);
        const groupUpdateUser = groupUpdateDetail.opUser;
        return (
          <>
            <b onClick={() => window.userClick(groupUpdateUser.userID)}>{isSelf(groupUpdateUser.userID) ? t("You") : groupUpdateUser.nickname}</b>
            {t("ModifiedGroup")}
          </>
        );
      case tipsTypes.GROUPOWNERTRANSFERRED:
        const transferDetails = JSON.parse(msg.notificationElem.detail);
        const transferOpUser = transferDetails.opUser;
        const newOwner = transferDetails.newGroupOwner;
        return (
          <>
            <b onClick={() => window.userClick(transferOpUser.userID)}>{isSelf(transferOpUser.userID) ? t("You") : transferOpUser.nickname}</b>
            {t("TransferTo")}
            <b onClick={() => window.userClick(newOwner.userID)}>{isSelf(newOwner.userID) ? t("You") : newOwner.nickname}</b>
          </>
        );
      case tipsTypes.MEMBERQUIT:
        const quitDetails = JSON.parse(msg.notificationElem.detail);
        const quitUser = quitDetails.quitUser;
        return (
          <>
            <b onClick={() => window.userClick(quitUser.userID)}>{isSelf(quitUser.userID) ? t("You") : quitUser.nickname}</b>
            {t("QuitedGroup")}
          </>
        );
      case tipsTypes.MEMBERINVITED:
        const inviteDetails = JSON.parse(msg.notificationElem.detail);
        const inviteOpUser = inviteDetails.opUser;
        const invitedUserList = inviteDetails.invitedUserList ?? [];
        let inviteUsers: any[] = [];
        invitedUserList.forEach((user: any) =>
          inviteUsers.push(
            <b onClick={() => window.userClick(user.userID)} key={user.userID}>
              {isSelf(user.userID) ? t("You") : user.nickname +" "}
            </b>
          )
        );
        return (
          <>
            <b onClick={() => window.userClick(inviteOpUser.userID)}>{isSelf(inviteOpUser.userID) ? t("You") : inviteOpUser.nickname}</b>
            {t("Invited")}
            {inviteUsers.map((user) => user)}
            {t("IntoGroup")}
          </>
        );
      case tipsTypes.MEMBERKICKED:
        const kickDetails = JSON.parse(msg.notificationElem.detail);
        const kickOpUser = kickDetails.opUser;
        const kickdUserList = kickDetails.kickedUserList ?? [];
        let kickUsers: any[] = [];
        kickdUserList.forEach((user: any) =>
          kickUsers.push(
            <b onClick={() => window.userClick(user.userID)} key={user.userID}>
              {isSelf(user.userID) ? t("You") : user.nickname}
            </b>
          )
        );
        return (
          <>
            <b onClick={() => window.userClick(kickOpUser.userID)}>{isSelf(kickOpUser.userID) ? t("You") : kickOpUser.nickname}</b>
            {t("Kicked")}
            {kickUsers.map((user) => user)}
            {t("OutGroup")}
          </>
        );
      case tipsTypes.MEMBERENTER:
        const enterDetails = JSON.parse(msg.notificationElem.detail);
        const enterUser = enterDetails.entrantUser;
        return (
          <>
            <b onClick={() => window.userClick(enterUser.userID)}>{isSelf(enterUser.userID) ? t("You") : enterUser.nickname}</b>
            {t("JoinedGroup")}
          </>
        );
      default:
        return JSON.parse(msg.content).defaultTips;
    }
  };

  const nextFuc = () => {
    loadMore(curCve?.userID, curCve?.groupID, msgList[msgList.length - 1]);
  };

  return (
    <div className="chat_bg">
      <ScrollView holdHeight={30} loading={loading} data={msgList} fetchMoreData={nextFuc} hasMore={hasMore}>
        {msgList?.map((msg) => {
          if (tipList.includes(msg.contentType)) {
            return (
              <div key={msg.clientMsgID} className="chat_bg_tips">
                {parseTip(msg)}
              </div>
            );
          } else {
            return (
              <MsgItem
                audio={audioRef}
                key={msg.clientMsgID}
                mutilSelect={mutilSelect}
                msg={msg}
                imgClick={imgClick}
                selfID={merID ?? selfID}
                curCve={curCve!}
              />
            );
          }
        })}
      </ScrollView>

      <audio ref={audioRef} />
    </div>
  );
};

export default ChatContent;
