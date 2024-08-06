import { GroupMemberRole } from "@openim/wasm-client-sdk";
import { GroupMemberItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { Empty, Spin } from "antd";
import { t } from "i18next";
import { forwardRef, memo, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";

import OIMAvatar from "@/components/OIMAvatar";
import { useCurrentMemberRole } from "@/hooks/useCurrentMemberRole";
import useGroupMembers from "@/hooks/useGroupMembers";

import styles from "./group-setting.module.scss";

const GroupMemberList = () => {
  const { currentMemberInGroup } = useCurrentMemberRole();
  const { fetchState, getMemberData, resetState } = useGroupMembers();

  useEffect(() => {
    if (currentMemberInGroup?.groupID) {
      getMemberData(true);
    }
    return () => {
      resetState();
    };
  }, [currentMemberInGroup?.groupID]);

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
            Header: () => (fetchState.loading ? <Spin /> : null),
          }}
          computeItemKey={(_, member) => member.userID}
          itemContent={(_, member) => <MemberItem member={member} />}
        />
      )}
    </div>
  );
};

export default forwardRef(GroupMemberList);

interface IMemberItemProps {
  member: GroupMemberItem;
}

const MemberItem = memo(({ member }: IMemberItemProps) => {
  const isOwner = member.roleLevel === GroupMemberRole.Owner;
  const isAdmin = member.roleLevel === GroupMemberRole.Admin;

  return (
    <div className={styles["list-member-item"]}>
      <div className="flex items-center overflow-hidden">
        <OIMAvatar src={member.faceURL} text={member.nickname} />
        <div className="ml-3 flex items-center">
          <div className="max-w-[120px] truncate">{member.nickname}</div>
          {isOwner && (
            <span className="ml-2 rounded border border-[#FF9831] px-1 text-xs text-[#FF9831]">
              {t("placeholder.groupOwner")}
            </span>
          )}
          {isAdmin && (
            <span className="ml-2 rounded border border-[#0289FA] px-1 text-xs text-[#0289FA]">
              {t("placeholder.administrator")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
