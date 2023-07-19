import { Empty } from "antd";
import { t } from "i18next";
import { FC } from "react";
import { Virtuoso } from "react-virtuoso";

import OIMAvatar from "@/components/OIMAvatar";
import useGroupMembers from "@/hooks/useGroupMembers";
import { GroupMemberItem } from "@/utils/open-im-sdk-wasm/types/entity";
import { GroupMemberRole } from "@/utils/open-im-sdk-wasm/types/enum";

import styles from "./group-setting.module.scss";

const GroupMemberList = () => {
  const { fetchState, getMemberData } = useGroupMembers();

  const endReached = () => {
    getMemberData();
  };

  return (
    <div className="h-full px-2 py-2.5">
      {fetchState.groupMemberList.length === 0 ? (
        <Empty
          className="flex h-full flex-col items-center justify-center"
          description={t("empty.noSearchResults")}
        />
      ) : (
        <Virtuoso
          className="h-full overflow-x-hidden"
          data={fetchState.groupMemberList}
          endReached={endReached}
          components={{
            Header: () => (fetchState.loading ? <div>loading...</div> : null),
          }}
          itemContent={(_, member) => <MemberItem member={member} />}
        />
      )}
    </div>
  );
};

export default GroupMemberList;

interface IMemberItemProps {
  member: GroupMemberItem;
}

const MemberItem: FC<IMemberItemProps> = ({ member }) => {
  const isOwner = member.roleLevel === GroupMemberRole.Owner;
  const isAdmin = member.roleLevel === GroupMemberRole.Admin;

  return (
    <div className={styles["list-member-item"]}>
      <div
        className="flex items-center overflow-hidden"
        onClick={() => window.userClick(member.userID, member.groupID)}
      >
        <OIMAvatar src={member.nickname} text={member.nickname} />
        <div className="ml-3 flex items-center">
          <div className="max-w-[120px] truncate">{member.nickname}</div>
          {isOwner && (
            <span className="ml-2 rounded border border-[#FF9831] px-1 text-xs text-[#FF9831]">
              群主
            </span>
          )}
          {isAdmin && (
            <span className="ml-2 rounded border border-[#0289FA] px-1 text-xs text-[#0289FA]">
              管理员
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
