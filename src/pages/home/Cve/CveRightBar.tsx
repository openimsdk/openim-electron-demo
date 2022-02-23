import { Layout, Tooltip } from "antd";
import right_file from "@/assets/images/right_file.png";
import right_file_se from "@/assets/images/right_file_se.png";
import right_search from "@/assets/images/right_search.png";
import right_search_se from "@/assets/images/right_search_se.png";
import right_setting from "@/assets/images/right_setting.png";
import right_setting_se from "@/assets/images/right_setting_se.png";
import right_notice from "@/assets/images/right_notice.png";
import right_notice_se from "@/assets/images/right_notice_se.png";
import { FC, useEffect, useState } from "react";
import { events, isSingleCve } from "../../../utils";
import { TOASSIGNCVE } from "../../../constants/events";
import CveRightDrawer from "./CveRightDrawer/CveRightDrawer";
import { useTranslation } from "react-i18next";
import { ConversationItem, FriendItem } from "../../../utils/open_im_sdk/types";

const { Sider } = Layout;

type CveRightBarProps = {
  curCve: ConversationItem;
};

const CveRightBar: FC<CveRightBarProps> = ({ curCve }) => {
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [curTool, setCurTool] = useState(-1);
  const { t } = useTranslation();

  useEffect(() => {
    events.on(TOASSIGNCVE, assignHandler);
    return () => {
      events.off(TOASSIGNCVE, assignHandler);
    };
  }, []);

  const assignHandler = () => {
    if (visibleDrawer) {
      setCurTool(-1);
      setVisibleDrawer(false);
    }
  };

  const onClose = () => {
    setVisibleDrawer(false);
    setCurTool(-1);
  };

  const clickItem = (idx: number) => {
    if (idx !== 2) {
      setCurTool(idx);
      setVisibleDrawer(true);
    }
  };

  const toolIcon = (tool: typeof tools[0]) => {
    if (tool.idx === 0 && isSingleCve(curCve)) return null;
    return (
      <Tooltip key={tool.tip} placement="right" title={tool.tip}>
        <div className="right_bar_col_icon" onClick={() => tool.method(tool.idx)}>
          <img src={curTool === tool.idx ? tool.icon_se : tool.icon} />
        </div>
      </Tooltip>
    );
  };

  const tools = [
    {
      tip: t("GroupAnnouncement"),
      icon: right_notice,
      icon_se: right_notice_se,
      method: clickItem,
      idx: 0,
    },
    {
      tip: t("Search"),
      icon: right_search,
      icon_se: right_search_se,
      method: clickItem,
      idx: 1,
    },
    {
      tip: t("File")+"(开发中~)",
      icon: right_file,
      icon_se: right_file_se,
      method: clickItem,
      idx: 2,
    },
    {
      tip: t("Setting"),
      icon: right_setting,
      icon_se: right_setting_se,
      method: clickItem,
      idx: 3,
    },
  ];

  return (
    <Sider width="42" theme="light" className="right_bar">
      <div className="right_bar_col">{tools.map((t) => toolIcon(t))}</div>
      {visibleDrawer && <CveRightDrawer curTool={curTool} visible={visibleDrawer} curCve={curCve} onClose={onClose} />}
    </Sider>
  );
};

export default CveRightBar;
