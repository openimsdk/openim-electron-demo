import { SearchOutlined } from "@ant-design/icons";
import { GroupMemberItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { useLatest } from "ahooks";
import { Breadcrumb, Input, Spin } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import clsx from "clsx";
import i18n, { t } from "i18next";
import {
  FC,
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Virtuoso } from "react-virtuoso";

import friend from "@/assets/images/chooseModal/friend.png";
import group from "@/assets/images/chooseModal/group.png";
import { useCurrentMemberRole } from "@/hooks/useCurrentMemberRole";
import useGroupMembers from "@/hooks/useGroupMembers";
import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { useContactStore } from "@/store/contact";

import CheckItem, { CheckListItem } from "./CheckItem";
import MenuItem from "./MenuItem";

const menuList = [
  {
    idx: 0,
    title: t("placeholder.myFriend"),
    icon: friend,
  },
  {
    idx: 1,
    title: t("placeholder.myGroup"),
    icon: group,
  },
];

i18n.on("languageChanged", () => {
  menuList[0].title = t("placeholder.myFriend");
  menuList[1].title = t("placeholder.myGroup");
});

export type ChooseMenuItem = (typeof menuList)[0];

interface IChooseBoxProps {
  className?: string;
  isCheckInGroup?: boolean;
  showGroupMember?: boolean;
  checkMemberRole?: boolean;
}

export interface ChooseBoxHandle {
  getCheckedList: () => CheckListItem[];
  updatePrevCheckList: (data: CheckListItem[]) => void;
  resetState: () => void;
}

const ChooseBox: ForwardRefRenderFunction<ChooseBoxHandle, IChooseBoxProps> = (
  props,
  ref,
) => {
  const { className, checkMemberRole, isCheckInGroup, showGroupMember } = props;

  const [checkedList, setCheckedList] = useState<CheckListItem[]>([]);
  const latestCheckedList = useLatest(checkedList);

  const checkClick = useCallback((data: CheckListItem) => {
    const idx = latestCheckedList.current.findIndex(
      (item) =>
        (item.userID && item.userID === data.userID) ||
        (item.groupID && item.groupID === data.groupID && !showGroupMember),
    );
    if (idx > -1) {
      setCheckedList((state) => {
        const newState = [...state];
        newState.splice(idx, 1);
        return newState;
      });
    } else {
      setCheckedList((state) => [...state, data]);
    }
  }, []);

  const isChecked = useCallback(
    (data: CheckListItem) =>
      checkedList.some(
        (item) =>
          (item.userID && item.userID === data.userID) ||
          (item.groupID && item.groupID === data.groupID && !showGroupMember),
      ),
    [checkedList.length, showGroupMember],
  );

  const resetState = () => {
    setCheckedList([]);
  };

  const updatePrevCheckList = (data: CheckListItem[]) => {
    setCheckedList([...data]);
  };

  useImperativeHandle(ref, () => ({
    getCheckedList: () => checkedList,
    resetState,
    updatePrevCheckList,
  }));

  return (
    <div
      className={clsx(
        "mx-9 mt-5 flex h-[480px] rounded-md border border-[var(--gap-text)]",
        className,
      )}
    >
      <div className="flex flex-1 flex-col border-r border-[var(--gap-text)]">
        <div className="p-5.5 pb-3">
          <Input
            allowClear
            spellCheck={false}
            prefix={
              <SearchOutlined rev={undefined} className="text-[var(--sub-text)]" />
            }
          />
        </div>
        {showGroupMember ? (
          <MemoMemberList
            isChecked={isChecked}
            checkMemberRole={checkMemberRole}
            checkClick={checkClick}
          />
        ) : (
          <MemoCommonLeft
            isCheckInGroup={isCheckInGroup!}
            isChecked={isChecked}
            checkClick={checkClick}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mx-5 py-5.5">
          {t("placeholder.selected")}
          <span className="text-[var(--primary)]">{` ${checkedList.length} `}</span>
        </div>
        <div className="mb-3 flex-1 overflow-y-auto">
          {checkedList.map((item) => (
            <CheckItem
              data={item}
              key={item.userID || item.groupID}
              cancelClick={checkClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(forwardRef(ChooseBox));

interface ICommonLeftProps {
  isCheckInGroup: boolean;
  checkClick: (data: CheckListItem) => void;
  isChecked: (data: CheckListItem) => boolean;
}

const CommonLeft: FC<ICommonLeftProps> = (
  { isCheckInGroup, checkClick, isChecked },
  ref,
) => {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemType[]>([]);
  const [checkList, setCheckList] = useState<CheckListItem[]>([]);

  const breadcrumbClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setBreadcrumb([]);
  };

  const checkInGroup = async (list: CheckListItem[]) => {
    const currentGroupID = useConversationStore.getState().currentConversation?.groupID;
    if (!isCheckInGroup || !currentGroupID) {
      return list;
    }
    const tmpList = JSON.parse(JSON.stringify(list)) as CheckListItem[];
    const userIDList = tmpList
      .filter((item) => Boolean(item.userID))
      .map((item) => item.userID!);
    try {
      const { data } = await IMSDK.getSpecifiedGroupMembersInfo({
        groupID: currentGroupID,
        userIDList,
      });
      const inGroupUserIDList = data.map((item) => item.userID);
      tmpList.map((item) => {
        item.disabled = inGroupUserIDList.includes(item.userID!);
      });
    } catch (error) {
      console.error(error);
    }
    return tmpList;
  };

  const menuClick = useCallback(async (idx: number) => {
    const pushItem = {
      title: "",
      className: "text-xs text-[var(--primary)]",
    };
    switch (idx) {
      case 0:
        setCheckList(await checkInGroup(useContactStore.getState().friendList));
        pushItem.title = t("placeholder.myFriend");
        break;
      case 1:
        setCheckList(await checkInGroup(useContactStore.getState().groupList));
        pushItem.title = t("placeholder.myGroup");
        break;
      default:
        break;
    }
    setBreadcrumb((state) => [...state, pushItem]);
  }, []);

  if (breadcrumb.length < 1) {
    return (
      <div className="flex-1 overflow-auto">
        {menuList.map((menu) => {
          if (menu.idx !== 0) {
            return null;
          }
          return <MenuItem menu={menu} key={menu.idx} menuClick={menuClick} />;
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb
        className="mx-5.5"
        separator=">"
        items={[
          {
            title: t("placeholder.contacts"),
            href: "",
            className: "text-xs text-[var(--sub-text)]",
            onClick: breadcrumbClick,
          },
          ...breadcrumb,
        ]}
      />
      <div className="mb-3 flex-1 overflow-y-auto">
        <Virtuoso
          className="h-full"
          data={checkList}
          itemContent={(_, item) => (
            <CheckItem
              showCheck
              isChecked={isChecked(item)}
              data={item}
              key={item.userID || item.groupID}
              itemClick={checkClick}
            />
          )}
        />
      </div>
    </div>
  );
};

const MemoCommonLeft = memo(CommonLeft);

interface IGroupMemberListProps {
  checkMemberRole?: boolean;
  checkClick: (data: CheckListItem) => void;
  isChecked: (data: CheckListItem) => boolean;
}

const GroupMemberList: FC<IGroupMemberListProps> = (
  { checkMemberRole, checkClick, isChecked },
  ref,
) => {
  const { currentRolevel, currentMemberInGroup } = useCurrentMemberRole();
  const { fetchState, getMemberData, resetState } = useGroupMembers({
    notRefresh: true,
  });

  useEffect(() => {
    if (currentMemberInGroup?.groupID) {
      getMemberData(true);
    }
    return () => {
      resetState();
    };
  }, [currentMemberInGroup?.groupID]);

  const endReached = () => {
    if (fetchState.loading || !fetchState.hasMore) {
      return;
    }
    getMemberData();
  };

  const isDisabled = (member: GroupMemberItem) => {
    if (!checkMemberRole) return false;
    return member.roleLevel >= currentRolevel;
  };

  return (
    <Virtuoso
      className="h-full overflow-x-hidden"
      data={fetchState.groupMemberList}
      endReached={endReached}
      components={{
        Header: () => (fetchState.loading ? <Spin /> : null),
      }}
      itemContent={(_, member) => (
        <CheckItem
          showCheck
          isChecked={isChecked(member)}
          disabled={isDisabled(member)}
          data={member}
          key={member.userID}
          itemClick={checkClick}
        />
      )}
    />
  );
};

const MemoMemberList = memo(GroupMemberList);
