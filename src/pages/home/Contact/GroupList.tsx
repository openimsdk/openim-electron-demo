import { UserOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import { MyAvatar } from "../../../components/MyAvatar";
import { SessionType } from "../../../constants/messageContentType";
import { FriendItem, GroupItem } from "../../../utils/open_im_sdk/types";

const GroupList = ({ groupList, clickItem }: { groupList: GroupItem[]; clickItem: (item: FriendItem | GroupItem, type: SessionType) => void }) => {
  
  const GroupListItem = ({ gp }: { gp: GroupItem }) => (
    <div onDoubleClick={() => clickItem(gp, SessionType.GROUPCVE)} className="group_item">
      <MyAvatar shape="square" size={36} src={gp.faceURL} icon={<UserOutlined />} />
      <div className="group_item_info">
        <div className="group_item_title">{gp.groupName}</div>
        <div className="group_item_sub">{`${gp.memberCount}人`}</div>
      </div>
    </div>
  );
  return (
    <div className="group_bg">
      {groupList.length > 0 ? groupList.map((gp) => <GroupListItem key={gp.groupID} gp={gp} />) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无群组" />}
    </div>
  );
};

export default GroupList;
