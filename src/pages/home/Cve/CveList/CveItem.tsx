import { UserOutlined } from "@ant-design/icons";
import { message, Popover, Badge, Skeleton } from "antd";
import { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import LayLoad from "../../../../components/LayLoad";
import { MyAvatar } from "../../../../components/MyAvatar";
import { setCveList } from "../../../../store/actions/cve";
import { formatDate, im, parseMessageType } from "../../../../utils";
import { ConversationItem, MessageItem, OptType } from "../../../../utils/open_im_sdk/types";

type CveItemProps = {
  cve: ConversationItem;
  idx: number;
  onClick: (cve: ConversationItem) => void;
  curCve: ConversationItem | null;
  curUid: string;
  cveList: ConversationItem[];
};

const CveItem: FC<CveItemProps> = ({ cve, onClick, curCve, curUid, cveList, idx }) => {
  const [popVis, setPopVis] = useState(false);
  const dispatch = useDispatch();
  const itemRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const parseLatestMsg = (lmsg: string): string => {
    if (lmsg === "") return lmsg;
    const pmsg: MessageItem = JSON.parse(lmsg);

    if (cve.draftText !== "") {
      let text = cve.draftText;
      const pattern = /\<img.*?\">/g;
      const matchArr = text.match(pattern);
      if (matchArr && matchArr.length > 0) {
        matchArr.map((matchRes) => {
          text = text.replaceAll(matchRes, t("Picture"));
        });
      }
      return t("Draft") + " " + text;
    }
    return parseMessageType(pmsg, curUid);
  };

  const parseLatestTime = (ltime: number): string => {
    const sendArr = formatDate(ltime);
    const dayArr = formatDate(ltime + 86400000);
    const curArr = formatDate(new Date().getTime());
    if (sendArr[3] === curArr[3]) {
      return sendArr[4] as string;
    } else if (dayArr[3] === curArr[3]) {
      return t("Yesterday");
    } else {
      return sendArr[3] as string;
    }
  };

  const isPin = () => {
    const options = {
      conversationID: cve.conversationID,
      isPinned: cve.isPinned,
    };
    im.pinConversation(options)
      .then((res) => {
        message.success(!cve.isPinned ? t("PinSuc") : t("CancelPinSuc"));
        cve.isPinned = !cve.isPinned;
      })
      .catch((err) => {});
  };

  const markAsRead = () => {
    if (cve.userID) {
      im.markC2CMessageAsRead({ userID: cve.userID, msgIDList: [] });
    } else {
      im.markGroupMessageHasRead(cve.groupID);
    }
  };

  const delCve = () => {
    im.deleteConversation(cve.conversationID)
      .then((res) => {
        const tarray = [...cveList];
        const farray = tarray.filter((c) => c.conversationID !== cve.conversationID);
        dispatch(setCveList(farray));
      })
      .catch((err) => message.error(t("AccessFailed")));
  };

  const PopContent = () => (
    <div onClick={() => setPopVis(false)} className="menu_list">
      <div className="item" onClick={isPin}>
        {cve.isPinned ? t("CancelPin") : t("Pin")}
      </div>
      {cve.unreadCount > 0 && (
        <div className="item" onClick={markAsRead}>
          {t("MarkAsRead")}
        </div>
      )}
      <div className="item" onClick={delCve}>
        {t("RemoveCve")}
      </div>
    </div>
  );

  const isRecv = (opt: OptType) => opt === OptType.Nomal;

  const parseLastMessage = isRecv(cve?.recvMsgOpt)
    ? parseLatestMsg(cve.latestMsg)
    : cve.unreadCount > 0
    ? `[${cve.unreadCount + t("Piece")}] ${parseLatestMsg(cve.latestMsg)}`
    : parseLatestMsg(cve.latestMsg);

  return (
    <Popover
      visible={popVis}
      onVisibleChange={(v) => setPopVis(v)}
      placement="bottomRight"
      overlayClassName="cve_item_menu"
      key={cve.conversationID}
      content={PopContent}
      title={null}
      trigger="contextMenu"
    >
      <div ref={itemRef} onClick={() => onClick(cve)} className={`cve_item ${curCve?.conversationID === cve.conversationID || cve.isPinned ? "cve_item_focus" : ""}`}>
        <LayLoad forceLoad={idx < 15} targetRef={itemRef} skeletonCmp={<Skeleton.Avatar active={true} size={36} shape="square" />}>
          <Badge size="small" dot={!isRecv(cve?.recvMsgOpt) && cve.unreadCount > 0} count={isRecv(cve?.recvMsgOpt) ? cve.unreadCount : null}>
            <MyAvatar shape="square" style={{ minWidth: "36px" }} size={36} icon={<UserOutlined />} src={cve.faceURL} />
          </Badge>
        </LayLoad>

        <div className="cve_info">
          <div data-time={parseLatestTime(cve.latestMsgSendTime)} className="cve_title">
            {cve.showName}
          </div>
          <div className={`cve_msg ${isRecv(cve?.recvMsgOpt) ? "" : "cve_msg_opt"}`} dangerouslySetInnerHTML={{ __html: parseLastMessage }}></div>
        </div>
      </div>
    </Popover>
  );
};

export default CveItem;
