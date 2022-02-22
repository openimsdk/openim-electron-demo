import { Badge, Layout, Modal, Popover, Tooltip } from "antd";

import styles from "./layout.module.less";

import cve from "@/assets/images/cve.png";
import cve_select from "@/assets/images/cve_select.png";
import cons from "@/assets/images/cons.png";
import cons_select from "@/assets/images/cons_select.png";
import { useResolvedPath, useMatch, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { FC, useEffect, useRef, useState } from "react";
import { RightOutlined, UserOutlined } from "@ant-design/icons";
import { im } from "../utils";
import { MyAvatar } from "../components/MyAvatar";
import UserCard from "../pages/home/components/UserCard";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../store";
import { useClickAway } from "ahooks";
import { getAdminUrl, getAxiosUrl, getIMUrl } from "../config";
import { useTranslation } from "react-i18next";
import { FullUserItem } from "../utils/open_im_sdk/types";

const { Sider } = Layout;

type ToolItem = {
  tip: string,
  icon: string,
  icon_select: string,
  path: string,
  idx: number,
}

const ToolIcon = ({ tool }: { tool: ToolItem }) => {
  let resolved = useResolvedPath(tool.path);
  let match = useMatch({ path: resolved.pathname, end: true });
  const [applications, setApplications] = useState(0);
  const unReadCount = useSelector(
    (state: RootState) => state.contacts.unReadCount,
    shallowEqual
  );
  const recvFriendApplicationList = useSelector(
    (state: RootState) => state.contacts.recvFriendApplicationList,
    shallowEqual
  );
  const recvGroupApplicationList = useSelector(
    (state: RootState) => state.contacts.recvGroupApplicationList,
    shallowEqual
  );

  useEffect(() => {
    let fan = 0;
    let gan = 0;
    recvFriendApplicationList.map((f) => {
      if (f.handleResult === 0) fan += 1;
    });
    recvGroupApplicationList.map((g) => {
      if (g.handleResult === 0) gan += 1;
    });
    setApplications(fan + gan);
  }, [recvFriendApplicationList, recvGroupApplicationList]);

  useEffect(()=>{
    if(window.electron){
      window.electron.unReadChange(unReadCount+applications)
    }   
   },[applications,unReadCount])
  

  return (
    <Link to={tool.path}>
      <Tooltip placement="right" title={tool.tip}>
        <div
          className={`${styles.tool_icon} ${
            match ? styles.tool_icon_focus : ""
          }`}
        >
          <Badge
            size="small"
            offset={[0, -8]}
            count={tool.idx === 0 ? unReadCount : applications}
          >
            <img
              width="18"
              height="18"
              src={match ? tool.icon_select : tool.icon}
            />
          </Badge>
        </div>
      </Tooltip>
    </Link>
  );
};

type ToolsBarProps = {
  userInfo: FullUserItem;
};

const ToolsBar: FC<ToolsBarProps> = ({ userInfo }) => {
  const [draggableCardVisible, setDraggableCardVisible] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const navigate = useNavigate();
  const popRef = useRef<HTMLDivElement>(null);
  const avaRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useClickAway(() => {
    if(showPop)setShowPop(false);
  },[popRef,avaRef]);


  const clickMenu = (idx: number) => {
    setShowPop(false);
    switch (idx) {
      case 0:
        setDraggableCardVisible(true);
        break;
      case 1:
        navigate('/profile',{
          state:{
            type:'set'
          }
        })
        break;
      case 2:
        navigate('/profile',{
          state:{
            type:'about'
          }
        })
        break;
      case 3:
        Modal.confirm({
          title:t("LogOut"),
          content:t("LogOutTip"),
          onOk:logout
        })
        break;
      default:
        break;
    }
  };

  const tools:ToolItem[] = [
    {
      tip: t("Message"),
      icon: cve,
      icon_select: cve_select,
      path: "/",
      idx: 0,
    },
    {
      tip: t("Contact"),
      icon: cons,
      icon_select: cons_select,
      path: "/contacts",
      idx: 1,
    },
  ];

  const logout = () => {
    im.logout();
    const IMUrl = getIMUrl();
    const IMAxiosUrl = getAxiosUrl();
    const IMAdminUrl = getAdminUrl();
    const LastUid = localStorage.getItem("lastimuid")
    localStorage.clear();
    localStorage.setItem("IMAxiosUrl",IMAxiosUrl);
    localStorage.setItem("IMUrl",IMUrl);
    localStorage.setItem("IMAdminUrl",IMAdminUrl);
    localStorage.setItem("IMAdminUrl",IMAdminUrl);
    localStorage.setItem("lastimuid",LastUid!);
    navigate("/login");
  };

  const closeDragCard = () => {
    setDraggableCardVisible(false);
  };

  const popMenus = [
    {
      title: t("MyInformation"),
      idx: 0,
    },
    {
      title: t("AccountSettings"),
      idx: 1,
    },
    {
      title: t("AboutUs"),
      idx: 2,
    },
    {
      title: t("LogOut"),
      idx: 3,
    },
  ];

  const popContent = (
    <div ref={popRef} className={styles.tool_self_menu}>
      {popMenus.map((menu) => {
        return (
          <div
            onClick={() => clickMenu(menu.idx)}
            key={menu.idx}
            className={styles.tool_self_item}
          >
            <div>{menu.title}</div>
            <RightOutlined style={{ color: "#b1b2b4", fontSize: "12px" }} />
          </div>
        );
      })}
    </div>
  );

  const popTitle = (
    <div className={styles.tool_self_title}>
      <MyAvatar
        className={styles.tool_self_icon}
        shape="square"
        size={34}
        icon={<UserOutlined />}
        src={userInfo.faceURL}
      />
      <Tooltip placement="right" title={userInfo.nickname}>
        <div className={styles.nick_name}>{userInfo.nickname}</div>
      </Tooltip>
    </div>
  );

  return (
    <Sider width="48" theme="light" className={styles.tool_bar}>
      <div className={styles.tools}>
        <Popover
          trigger="click"
          placement="right"
          content={popContent}
          title={popTitle}
          visible={showPop}
        >
          <div ref={avaRef} onClick={() => setShowPop(true)}>
            <MyAvatar
              className={styles.left_avatar}
              shape="square"
              size={36}
              src={userInfo.faceURL}
            />
          </div>
        </Popover>
        {tools.map((t, idx) => (
          <ToolIcon tool={t} key={idx} />
        ))}
      </div>
      {draggableCardVisible && (
        <UserCard
          close={closeDragCard}
          info={userInfo}
          type="self"
          draggableCardVisible={draggableCardVisible}
        />
      )}
    </Sider>
  );
};

export default ToolsBar;
