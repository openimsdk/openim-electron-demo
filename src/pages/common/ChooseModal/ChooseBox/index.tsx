import { SearchOutlined } from "@ant-design/icons";
import { useLatest } from "ahooks";
import { Breadcrumb, Input } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import clsx from "clsx";
import i18n, { t } from "i18next";
import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Virtuoso } from "react-virtuoso";

import friend from "@/assets/images/chooseModal/friend.png";
import group from "@/assets/images/chooseModal/group.png";
import recently from "@/assets/images/chooseModal/recently.png";
import { useCurrentMemberRole } from "@/hooks/useCurrentMemberRole";
import useGroupMembers, { REACH_SEARCH_FLAG } from "@/hooks/useGroupMembers";
import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore, useUserStore } from "@/store";
import { useContactStore } from "@/store/contact";
import { feedbackToast } from "@/utils/common";
import { GroupMemberItem } from "@/utils/open-im-sdk-wasm/types/entity";

import CheckItem, { CheckListItem } from "./CheckItem";
import MenuItem from "./MenuItem";

const menuList = [
  {
    idx: 0,
    title: t("placeholder.latestChat"),
    icon: recently,
  },
  {
    idx: 1,
    title: t("placeholder.myFriend"),
    icon: friend,
  },
  {
    idx: 2,
    title: t("placeholder.myGroup"),
    icon: group,
  },
];

i18n.on("languageChanged", () => {
  menuList[0].title = t("placeholder.latestChat");
  menuList[1].title = t("placeholder.myFriend");
  menuList[2].title = t("placeholder.myGroup");
});

export type ChooseMenuItem = (typeof menuList)[0];

interface IChooseBoxProps {
  className?: string;
  isCheckInGroup?: boolean;
  notConversation?: boolean;
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
  const {
    className,
    isCheckInGroup,
    notConversation,
    showGroupMember,
    checkMemberRole,
  } = props;

  const [checkedList, setCheckedList] = useState<CheckListItem[]>([]);
  const latestCheckedList = useLatest(checkedList);

  const [searchState, setSearchState] = useState({
    keywords: "",
    searching: false,
  });

  const memberListRef = useRef<MemberListHandle>(null);

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

  const onEnterSearch = () => {
    if (!searchState.keywords) return;
    setSearchState((state) => ({ ...state, searching: true }));
    memberListRef.current?.searchMember(searchState.keywords);
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
            value={searchState.keywords}
            allowClear
            onChange={(e) =>
              setSearchState((state) => ({
                searching: e.target.value ? state.searching : false,
                keywords: e.target.value,
              }))
            }
            onPressEnter={onEnterSearch}
            prefix={<SearchOutlined rev={undefined} className="text-[#8e9ab0]" />}
          />
        </div>
        {showGroupMember ? (
          <ForwardMemberList
            ref={memberListRef}
            isChecked={isChecked}
            checkClick={checkClick}
            checkMemberRole={checkMemberRole}
            isSearching={searchState.searching}
          />
        ) : (
          <CommonLeft
            notConversation={notConversation!}
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

const CommonLeft = memo(
  ({
    notConversation,
    isCheckInGroup,
    checkClick,
    isChecked,
  }: {
    notConversation: boolean;
    isCheckInGroup: boolean;
    checkClick: (data: CheckListItem) => void;
    isChecked: (data: CheckListItem) => boolean;
  }) => {
    const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemType[]>([]);
    const [checkList, setCheckList] = useState<CheckListItem[]>([]);

    const conversationList = useConversationStore((state) => state.conversationList);
    const currentGroupID = useConversationStore(
      (state) => state.currentConversation?.groupID,
    );
    const friendList = useContactStore((state) => state.friendList);
    const groupList = useContactStore((state) => state.groupList);

    const breadcrumbClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      setBreadcrumb([]);
    };

    const checkInGroup = async (list: CheckListItem[]) => {
      if (!isCheckInGroup || !currentGroupID) {
        return list;
      }
      const tmpList = JSON.parse(JSON.stringify(list)) as CheckListItem[];
      const userIDList = tmpList
        .filter((item) => Boolean(item.userID))
        .map((item) => item.userID!);
      try {
        const { data } = await IMSDK.getSpecifiedGroupMembersInfo<GroupMemberItem[]>({
          groupID: currentGroupID,
          userIDList,
        });
        const inGroupUserIDList = data.map((item) => item.userID);
        tmpList.map((item) => {
          item.disabled = inGroupUserIDList.includes(item.userID!);
        });
      } catch (error) {
        console.log(error);
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
          setCheckList(await checkInGroup(conversationList));
          pushItem.title = t("placeholder.latestChat");
          break;
        case 1:
          setCheckList(await checkInGroup(friendList));
          pushItem.title = t("placeholder.myFriend");
          break;
        case 2:
          setCheckList(await checkInGroup(groupList));
          pushItem.title = t("placeholder.myFriend");
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
            if (notConversation && menu.idx !== 1) {
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
  },
);

interface IGroupMemberListProps {
  isSearching?: boolean;
  checkMemberRole?: boolean;
  checkClick: (data: CheckListItem) => void;
  isChecked: (data: CheckListItem) => boolean;
}

interface MemberListHandle {
  searchMember: (keywords: string) => void;
}

const GroupMemberList: ForwardRefRenderFunction<
  MemberListHandle,
  IGroupMemberListProps
> = ({ isSearching, checkMemberRole, checkClick, isChecked }, ref) => {
  const { currentRolevel } = useCurrentMemberRole();
  const { fetchState, searchMember, getMemberData } = useGroupMembers({
    notRefresh: true,
  });

  const endReached = () => {
    if (fetchState.loading || !fetchState.hasMore) {
      return;
    }
    if (!isSearching) {
      getMemberData();
    } else {
      searchMember(REACH_SEARCH_FLAG);
    }
  };

  const isDisabled = (member: GroupMemberItem) => {
    if (!checkMemberRole) return false;
    return member.roleLevel >= currentRolevel;
  };

  useImperativeHandle(
    ref,
    () => ({
      searchMember,
    }),
    [],
  );

  const dataSource = isSearching
    ? fetchState.searchMemberList
    : fetchState.groupMemberList;

  return (
    <Virtuoso
      className="h-full overflow-x-hidden"
      data={dataSource}
      endReached={endReached}
      components={{
        Header: () => (fetchState.loading ? <div>loading...</div> : null),
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

const ForwardMemberList = memo(forwardRef(GroupMemberList));
