import { Empty, List } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ConversationItem } from "../../../../utils/open_im_sdk/types";
import CveItem from "./CveItem";



type CveListProps = {
  cveList: ConversationItem[];
  clickItem: (cve: ConversationItem) => void;
  loading: boolean;
  marginTop?: number;
  curCve: ConversationItem | null;
};

const CveList: FC<CveListProps> = ({ cveList, clickItem, loading, marginTop, curCve }) => {
  const curUid = useSelector((state: RootState) => state.user.selfInfo.userID, shallowEqual);
  const { t } = useTranslation();
  
  return (
    <div className="cve_list">
      {cveList.length > 0 ? (
        <List
          className="cve_list_scroll"
          style={{ height: `calc(100vh - ${marginTop}px)` }}
          itemLayout="horizontal"
          dataSource={cveList}
          split={false}
          loading={loading}
          renderItem={(item,idx) => <CveItem idx={idx} cveList={cveList} curUid={curUid!} curCve={curCve} key={item.conversationID} onClick={clickItem} cve={item} />}
        />
      ) : (
        <Empty description={t("NoCve")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};

CveList.defaultProps = {
  marginTop: 58,
};

export default CveList;
