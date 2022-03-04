import { LoadingOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Spin, Checkbox } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { MyAvatar } from "../../../../components/MyAvatar";
import { messageTypes } from "../../../../constants/messageContentType";
import { events, im, isSingleCve } from "../../../../utils";

import { ATSTATEUPDATE, MUTILMSGCHANGE } from "../../../../constants/events";
import { useInViewport, useLongPress } from "ahooks";

import SwitchMsgType from "./SwitchMsgType/SwitchMsgType";
import MsgMenu from "./MsgMenu/MsgMenu";
import { useTranslation } from "react-i18next";
import { ConversationItem, MessageItem, PictureElem } from "../../../../utils/open_im_sdk/types";

type MsgItemProps = {
  msg: MessageItem;
  selfID: string;
  imgClick: (el: PictureElem) => void;
  audio: React.RefObject<HTMLAudioElement>;
  curCve: ConversationItem;
  mutilSelect?: boolean;
};

const canSelectTypes = [messageTypes.TEXTMESSAGE, messageTypes.ATTEXTMESSAGE, messageTypes.PICTUREMESSAGE,messageTypes.VIDEOMESSAGE,messageTypes.VOICEMESSAGE, messageTypes.CARDMESSAGE,messageTypes.FILEMESSAGE,messageTypes.LOCATIONMESSAGE];

const MsgItem: FC<MsgItemProps> = (props) => {
  const { msg, selfID, curCve, mutilSelect, audio } = props;

  const [lastChange, setLastChange] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const avaRef = useRef<HTMLDivElement>(null);
  const msgItemRef = useRef<HTMLDivElement>(null);
  const [inViewport] = useInViewport(msgItemRef);
  const { t } = useTranslation();

  useEffect(() => {
    if (lastChange) {
      setLastChange(false);
    }
  }, [mutilSelect]);

  useEffect(() => {
    if (inViewport && curCve.userID === msg.sendID && !msg.isRead) {
      markC2CHasRead(msg.sendID, msg.clientMsgID);
    }
  }, [inViewport, curCve]);

  const isSelf = (sendID: string): boolean => {
    return selfID === sendID;
  };

  const markC2CHasRead = (userID: string, msgID: string) => {
    msg.isRead = true;
    im.markC2CMessageAsRead({ userID, msgIDList: [msgID] });
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const switchTip = () => {
    switch (msg.status) {
      case 1:
        return <Spin indicator={antIcon} />;
      case 2:
        if (curCve && isSingleCve(curCve)) {
          return msg.isRead ? t("Readed") : t("UnRead");
        }
        return null;
      case 3:
        return <ExclamationCircleFilled style={{ color: "#f34037", fontSize: "20px" }} />;
      default:
        break;
    }
  };

  const switchStyle = () => {
    if (isSelf(msg.sendID)) {
      return {
        marginLeft: "12px",
      };
    } else {
      return {
        marginRight: "12px",
      };
    }
  };

  const mutilCheckItem = () => {
    if (mutilSelect && canSelectTypes.includes(msg.contentType)) {
      events.emit(MUTILMSGCHANGE, !lastChange, msg);
      setLastChange((v) => !v);
    }
  };

  const avatarLongPress = () => {
    if (!isSingleCve(curCve!)) {
      events.emit(ATSTATEUPDATE, msg.sendID, msg.senderNickname);
    }
  };

  useLongPress(avatarLongPress, avaRef, {
    onClick: () => window.userClick(msg.sendID),
    delay: 500,
  });

  return (
    <div ref={msgItemRef} onClick={mutilCheckItem} className={`chat_bg_msg ${isSelf(msg.sendID) ? "chat_bg_omsg" : ""}`}>
      {mutilSelect && (
        <div style={switchStyle()} className="chat_bg_msg_check">
          <Checkbox disabled={!canSelectTypes.includes(msg.contentType)} checked={lastChange} />
        </div>
      )}

      <div className="cs">
        <div ref={avaRef}>
          <MyAvatar className="chat_bg_msg_icon" shape="square" size={42} src={msg.senderFaceUrl} />
        </div>
      </div>

      <div className="chat_bg_msg_content">
        {(!curCve || !isSingleCve(curCve)) && <span className="nick">{msg.senderNickname}</span>}
        <MsgMenu key={msg.clientMsgID} visible={contextMenuVisible} msg={msg} isSelf={isSelf(msg.sendID)} visibleChange={(v) => setContextMenuVisible(v)}>
          <SwitchMsgType {...props} />
        </MsgMenu>
      </div>

      {isSelf(msg.sendID) ? (
        <div style={{ color: msg.isRead ? "#999" : "#428BE5", marginTop: curCve && isSingleCve(curCve) ? "0" : "24px" }} className="chat_bg_flag">
          {switchTip()}
        </div>
      ) : null}
    </div>
  );
};

export default MsgItem;
