import { SearchOutlined } from "@ant-design/icons";
import { Empty, Input, message, Modal, Tooltip } from "antd";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, shallowEqual } from "react-redux";
import { debounce } from "throttle-debounce";
import { RootState } from "../../../../../store";
import { GroupMemberItem } from "../../../../../utils/open_im_sdk/types";
import { GroupRole } from "../CveRightDrawer";
import MemberItem from "./MemberItem";

type MemberDrawerProps = {
  groupMembers: GroupMemberItem[];
  role: GroupRole;
  selfID: string;
  gid: string;
};

const MemberDrawer: FC<MemberDrawerProps> = (props) => {
  const { groupMembers } = props;

  const [searchStatus, setSearchStatus] = useState(false);
  const [searchList, setSearchList] = useState<GroupMemberItem[]>([]);
  const member2Status = useSelector((state: RootState) => state.contacts.member2status, shallowEqual);
  const { t } = useTranslation();

  const onSearch = (e: any) => {
    if (e.key === "Enter") {
      const text = e.target.value;
      if (text !== "") {
        const tmpArr = groupMembers.filter((gm) => gm.userID.indexOf(text) > -1 || gm.nickname.indexOf(text) > -1);
        setSearchList(tmpArr);
        setSearchStatus(true);
      }
    }
  };

  const search = (text: string) => {
    const tmpArr = groupMembers.filter((gm) => gm.userID.indexOf(text) > -1 || gm.nickname.indexOf(text) > -1);
    setSearchList(tmpArr);
    setSearchStatus(true);
  };

  const debounceSearch = debounce(500, search);

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setSearchList([]);
      setSearchStatus(false);
    } else {
      debounceSearch(e.target.value);
    }
  };

  return (
    <div className="group_members">
      <div className="group_members_search">
        <Input onKeyDown={onSearch} onChange={inputOnChange} placeholder={t("Search")} prefix={<SearchOutlined />} />
      </div>
      <div className="group_members_list">
        {searchStatus && searchList.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("EmptySearch")} />
        ) : (
          (searchStatus ? searchList : groupMembers).map((g,idx) => <MemberItem key={g.userID} item={g} idx={idx} member2Status={member2Status} {...props} />)
        )}
      </div>
    </div>
  );
};

export default MemberDrawer;
