import { UserOutlined, AudioOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Layout, message, Select, Tooltip } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { DetailType, OnLineResType } from "../../../@types/open_im";
import { getOnline } from "../../../api/admin";
import { MyAvatar } from "../../../components/MyAvatar";
import { RootState } from "../../../store";
import { events, im, isSingleCve } from "../../../utils";

import members from "@/assets/images/members.png";
import { setMember2Status } from "../../../store/actions/contacts";
import { useTranslation } from "react-i18next";
import { ConversationItem, GroupItem } from "../../../utils/open_im_sdk/types";
import { useUpdateEffect } from "ahooks";
import { APPLICATIONTYPEUPDATE } from "../../../constants/events";

const { Header } = Layout;

type HeaderProps = {
  isShowBt?: boolean;
  type: "chat" | "contact";
  title?: string;
  curCve?: ConversationItem;
  typing?: boolean;
  ginfo?: GroupItem;
};

const HomeHeader: FC<HeaderProps> = ({ isShowBt, type, title, curCve, typing, ginfo }) => {
  const { t } = useTranslation();
  const [onlineStatus, setOnlineStatus] = useState<string>(t("Offline"));
  const [onlineNo, setOnlineNo] = useState(0);
  const groupMemberList = useSelector((state: RootState) => state.contacts.groupMemberList, shallowEqual);
  const groupMemberLoading = useSelector((state: RootState) => state.contacts.groupMemberLoading, shallowEqual);
  const adminToken = useSelector((state: RootState) => state.user.adminToken, shallowEqual);
  const dispatch = useDispatch();
  const lastCve = useRef<ConversationItem | undefined>(undefined);

  useEffect(() => {
    if (
      (curCve?.conversationID == lastCve.current?.conversationID && curCve?.faceURL === lastCve.current?.faceURL && curCve?.showName === lastCve.current?.showName) ||
      groupMemberLoading
    )
      return;
    lastCve.current = curCve;
    if (type === "chat") {
      if (isSingleCve(curCve!)) {
        getOnline([curCve!.userID], adminToken).then((res) => {
          const statusItem = res.data[0];
          if (statusItem.userID === curCve?.userID) {
            switchOnline(statusItem.status, statusItem.detailPlatformStatus);
          }
        });
      } else if (!isSingleCve(curCve!) && !groupMemberLoading && groupMemberList.length > 0) {
        getGroupOnline();
      }
    }
  }, [type, curCve, groupMemberList, groupMemberLoading, lastCve]);

  const switchOnline = (oType: string, details?: DetailType[]) => {
    switch (oType) {
      case "offline":
        setOnlineStatus(t("Offline"));
        break;
      case "online":
        let str = "";
        details?.map((detail) => {
          if (detail.status === "online") {
            str += `${detail.platform}/`;
          }
        });
        setOnlineStatus(`${str.slice(0, -1)} ${t("Online")}`);
        break;
      default:
        break;
    }
  };

  const getGroupOnline = () => {
    const tmplist = [...groupMemberList];
    const total = Math.ceil(tmplist.length / 200);
    let promiseArr: Array<Promise<OnLineResType>> = [];
    for (let i = 0; i < total; i++) {
      promiseArr.push(
        getOnline(
          tmplist.splice(0, 200).map((m) => m.userID),
          adminToken
        )
      );
    }

    Promise.all(promiseArr).then((res) => {
      let count = 0;
      let obj = {};
      res.map((pres) => {
        pres?.data?.map((item) => {
          obj = { ...obj, [item.userID]: item };
          if (item.status === "online") {
            count += 1;
          }
        });
      });

      dispatch(setMember2Status(obj));
      setOnlineNo(count);
    });
  };

  const voiceCall = () => {
    message.info("敬请期待~");
  };

  const videoCall = () => {
    message.info("敬请期待~");
  };

  const SingleCveInfo = () => (
    <>
      <span style={{ backgroundColor: onlineStatus === t("Offline") ? "#959595" : "#0ecc63" }} className="icon" />
      <span className="online">{onlineStatus}</span>
    </>
  );

  const GroupCveInfo = () => (
    <>
      <div className="num">
        <img src={members} alt="" />
        <span>{ginfo?.memberCount}</span>
      </div>
      <div className="num">
        <span className="icon" />
        <span className="online">{`${onlineNo} ${t("OnlineEx")}`}</span>
      </div>
    </>
  );

  const ChatHeader = () => (
    <div className="chat_header_box">
      <div className="chat_header_box_left">
        <MyAvatar shape="square" size={42} src={curCve?.faceURL} icon={<UserOutlined />} />
        <div className="cur_status">
          <div className="cur_status_nick">{curCve?.showName}</div>
          <div className="cur_status_update">
            {isSingleCve(curCve!) ? <SingleCveInfo /> : <GroupCveInfo />}
            {typing ? <span className="typing">{t("InInput")}</span> : null}
          </div>
        </div>
      </div>
      <div className="chat_header_box_right">
        <Tooltip placement="right" title={t("VoiceCall")}>
          <AudioOutlined onClick={voiceCall} />
        </Tooltip>
        <Tooltip placement="right" title={t("VideoCall")}>
          <PlayCircleOutlined onClick={videoCall} />
        </Tooltip>
      </div>
    </div>
  );

  const ConsHeader = () => {
    const [origin, setOrigin] = useState("recv");

    useUpdateEffect(() => {
      events.emit(APPLICATIONTYPEUPDATE, origin);
    }, [origin]);

    let recvLable,
      sentLable = "";
    const selectAble = title === t("NewFriend") || title === t("NewGroups");
    if (title === t("NewFriend")) {
      recvLable = t("NewFriend");
      sentLable = t("MyRequest");
    } else {
      recvLable = t("GroupApplication");
      sentLable = t("MyApplication");
    }

    const onSelect = (value: string) => {
      setOrigin(value);
    };

    return (
      <div className="chat_header_box chat_header_cons">
        <div>{title}</div>
        {selectAble && (
          <Select onSelect={onSelect} defaultValue="recv" style={{ width: 120 }} allowClear>
            <Select.Option value="recv">{recvLable}</Select.Option>
            <Select.Option value="sent">{sentLable}</Select.Option>
          </Select>
        )}
      </div>
    );
  };

  return (
    <Header className="chat_header" style={{ borderBottom: isShowBt ? "1px solid #dedfe0" : "none" }}>
      {type === "chat" ? <ChatHeader /> : <ConsHeader />}
    </Header>
  );
};

HomeHeader.defaultProps = {
  isShowBt: true,
};

export default HomeHeader;
