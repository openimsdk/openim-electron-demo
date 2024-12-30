import { GroupMemberRole } from "@openim/wasm-client-sdk";
import { GroupMemberItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { Empty, Spin } from "antd";
import { t } from "i18next";
import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useEffect,
  useImperativeHandle,
} from "react";
import { Virtuoso } from "react-virtuoso";

import OIMAvatar from "@/components/OIMAvatar";
import { useCurrentMemberRole } from "@/hooks/useCurrentMemberRole";
import useGroupMembers, { REACH_SEARCH_FLAG } from "@/hooks/useGroupMembers";
import { useUserStore } from "@/store";

import styles from "./group-setting.module.scss";

export interface GroupMemberListHandle {
  searchMember: (keyword: string) => void;
}

interface IGroupMemberListProps {
  isSearching: boolean;
}

const GroupMemberList: ForwardRefRenderFunction<
  GroupMemberListHandle,
  IGroupMemberListProps
> = ({ isSearching }, ref) => {
  const selfUserID = useUserStore((state) => state.selfInfo.userID);
  const { currentMemberInGroup } = useCurrentMemberRole();
  const { fetchState, getMemberData, searchMember, resetState } = useGroupMembers();

  useEffect(() => {
    if (currentMemberInGroup?.groupID) {
      getMemberData(true);
    }
    return () => {
      resetState();
    };
  }, [currentMemberInGroup?.groupID]);

  useImperativeHandle(ref, () => ({
    searchMember,
  }));

  const endReached = () => {
    if (!isSearching) {
      getMemberData();
    } else {
      searchMember(REACH_SEARCH_FLAG);
    }
  };

  const dataSource = isSearching
    ? fetchState.searchMemberList
    : fetchState.groupMemberList;

  return (
    <div className="h-full px-2 py-2.5">
      {isSearching && dataSource.length === 0 ? (
        <Empty
          className="flex h-full flex-col items-center justify-center"
          description={t("empty.noSearchResults")}
        />
      ) : (
        <Virtuoso
          className="h-full overflow-x-hidden"
          data={dataSource}
          endReached={endReached}
          components={{
            Header: () => (fetchState.loading ? <Spin /> : null),
          }}
          itemContent={(_, member) => (
            <MemberItem member={member} selfUserID={selfUserID} />
          )}
        />
      )}
    </div>
  );
};

export default forwardRef(GroupMemberList);

interface IMemberItemProps {
  member: GroupMemberItem;
  selfUserID: string;
}

const MemberItem = memo(({ member }: IMemberItemProps) => {
  const isOwner = member.roleLevel === GroupMemberRole.Owner;
  const isAdmin = member.roleLevel === GroupMemberRole.Admin;

  return (
    <div className={styles["list-member-item"]}>
      <div
        className="flex items-center overflow-hidden"
        onClick={() => window.userClick(member.userID, member.groupID)}
      >
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
