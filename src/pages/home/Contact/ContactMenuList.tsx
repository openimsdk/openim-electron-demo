import { shallowEqual } from "@babel/types";
import { Badge, List } from "antd";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

type ConsMenuItemProps = {
  menu: MenuItem;
  onClick: (menu: MenuItem) => void;
  curTab: string;
};

const ConsMenuItem: FC<ConsMenuItemProps> = ({ menu, onClick, curTab }) => {
  const [fps, setFps] = useState(0);
  const [gps, setGps] = useState(0);
  const friendApplicationList = useSelector(
    (state: RootState) => state.contacts.recvFriendApplicationList,
    shallowEqual
  );
  const groupApplicationList = useSelector(
    (state: RootState) => state.contacts.recvGroupApplicationList,
    shallowEqual
  );

  useEffect(() => {
    let fpn = 0;
    let gpn = 0;
    friendApplicationList.map((f) => {
      if (f.handleResult === 0) {
        fpn += 1;
      }
    });
    groupApplicationList.map((g) => {
      if (g.handleResult === 0) {
        gpn += 1;
      }
    });

    setFps(fpn);
    setGps(gpn);
  }, [friendApplicationList, groupApplicationList]);

  const setCount = (idx: number) => {
    switch (idx) {
      case 1:
        return fps;
      case 2:
        return gps;
      default:
        return 0;
    }
  };

  return (
    <div
      onClick={() => onClick(menu)}
      key={menu.idx}
      className={`cve_item ${menu.title === curTab ? "cve_item_focus" : ""}`}
    >
      <div className="con_icon" style={{ backgroundColor: menu.bgc }}>
        <Badge size="small" count={setCount(menu.idx)}>
          <img src={menu.icon} alt="" />
        </Badge>
      </div>
      <div className="con_info">
        <span>{menu.title}</span>
      </div>
    </div>
  );
};

export type MenuItem = {
  title: string;
  icon: string;
  bgc: string;
  idx: number;
  suffix: string;
};

type ContactListProps = {
  menus: MenuItem[];
  menusClick: (menu: MenuItem) => void;
  curTab: string;
};

const ContactMenuList: FC<ContactListProps> = ({
  menus,
  menusClick,
  curTab,
}) => {
  return (
    <div className="cve_list">
      <List
        itemLayout="horizontal"
        dataSource={menus}
        split={false}
        renderItem={(item) => (
          <ConsMenuItem curTab={curTab} onClick={menusClick} menu={item} />
        )}
      />
    </div>
  );
};

export default ContactMenuList;
