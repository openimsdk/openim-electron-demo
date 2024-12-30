import { SearchOutlined } from "@ant-design/icons";
import { SessionType } from "@openim/wasm-client-sdk";
import { GroupMemberItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { useDebounceFn, useLatest } from "ahooks";
import { Breadcrumb, Input, Spin } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import clsx from "clsx";
import i18n, { t } from "i18next";
import {
  ChangeEvent,
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useCallback,
  useEffect,
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
import { useConversationStore } from "@/store";
import { useContactStore } from "@/store/contact";
import { feedbackToast } from "@/utils/common";

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
  chooseOneOnly?: boolean;
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
    chooseOneOnly,
    checkMemberRole,
  } = props;

  const [checkedList, setCheckedList] = useState<CheckListItem[]>([]);
  const latestCheckedList = useLatest(checkedList);

  const [searchState, setSearchState] = useState({
    keywords: "",
    searching: false,
    canSearch: showGroupMember,
  });

  const memberListRef = useRef<MemberListHandle>(null);
  const commLeftRef = useRef<CommonLeftHandle>(null);

  const checkClick = useCallback(
    (data: CheckListItem) => {
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
        if (chooseOneOnly && latestCheckedList.current.length > 0) {
          feedbackToast({
            msg: t("toast.beyondSelectionLimit"),
            error: t("toast.beyondSelectionLimit"),
          });
          return;
        }

        setCheckedList((state) => [...state, data]);
      }
    },
    [chooseOneOnly],
  );

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

  const { run: onEnterSearch } = useDebounceFn(
    () => {
      if (!searchState.keywords) return;
      setSearchState((state) => ({ ...state, searching: true }));

      if (showGroupMember) {
        memberListRef.current?.searchMember(searchState.keywords);
      } else {
        commLeftRef.current?.getFilterCheckList(searchState.keywords);
      }
    },
    { wait: 150 },
  );

  const updateIsCanSearch = useCallback((canSearch: boolean) => {
    setSearchState((state) => ({ ...state, canSearch }));
  }, []);

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
            spellCheck={false}
            disabled={!searchState.canSearch}
            onChange={(e) => {
              setSearchState((state) => ({
                searching: e.target.value ? state.searching : false,
                keywords: e.target.value,
                canSearch: state.canSearch,
              }));
              onEnterSearch();
            }}
            prefix={
              <SearchOutlined rev={undefined} className="text-[var(--sub-text)]" />
            }
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
          <ForwardCommonLeft
            ref={commLeftRef}
            notConversation={notConversation!}
            isCheckInGroup={isCheckInGroup!}
            isSearching={searchState.searching}
            isChecked={isChecked}
            checkClick={checkClick}
            updateIsCanSearch={updateIsCanSearch}
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
  notConversation: boolean;
  isCheckInGroup: boolean;
  isSearching: boolean;
  checkClick: (data: CheckListItem) => void;
  isChecked: (data: CheckListItem) => boolean;
  updateIsCanSearch: (canSearch: boolean) => void;
}

interface CommonLeftHandle {
  getFilterCheckList: (keyword: string) => void;
}

const CommonLeft: ForwardRefRenderFunction<CommonLeftHandle, ICommonLeftProps> = (
  {
    notConversation,
    isCheckInGroup,
    isSearching,
    checkClick,
    isChecked,
    updateIsCanSearch,
  },
  ref,
) => {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemType[]>([]);
  const [checkList, setCheckList] = useState<CheckListItem[]>([]);
  const [searchList, setSearchList] = useState<CheckListItem[]>([]);

  const breadcrumbClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setBreadcrumb([]);
    updateIsCanSearch(false);
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
      const { data } = await IMSDK.getUsersInGroup({
        groupID: currentGroupID,
        userIDList,
      });
      tmpList.map((item) => {
        item.disabled = data.includes(item.userID!);
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
        setCheckList(
          await checkInGroup(
            useConversationStore
              .getState()
              .conversationList.filter(
                (conversation) =>
                  conversation.conversationType !== SessionType.Notification,
              ),
          ),
        );
        pushItem.title = t("placeholder.latestChat");
        break;
      case 1:
        setCheckList(await checkInGroup(useContactStore.getState().friendList));
        pushItem.title = t("placeholder.myFriend");
        break;
      case 2:
        setCheckList(await checkInGroup(useContactStore.getState().groupList));
        pushItem.title = t("placeholder.myGroup");
        break;
      default:
        break;
    }
    setBreadcrumb((state) => [...state, pushItem]);
    updateIsCanSearch(true);
  }, []);

  const getFilterCheckList = (keyword: string) => {
    if (!keyword) {
      setSearchList([]);
      return;
    }

    const upperCaseKeyword = keyword.toUpperCase();
    const filterList = checkList.filter((item) => {
      if (item.conversationID) {
        return item.showName?.toUpperCase().includes(upperCaseKeyword);
      }
      if (item.groupID) {
        return (
          item.groupName?.toUpperCase().includes(upperCaseKeyword) ||
          item.groupID?.toUpperCase().includes(upperCaseKeyword)
        );
      }
      return (
        item.nickname?.toUpperCase().includes(upperCaseKeyword) ||
        item.userID?.toUpperCase().includes(upperCaseKeyword) ||
        item.remark?.toUpperCase().includes(upperCaseKeyword)
      );
    });
    setSearchList(filterList);
  };

  useImperativeHandle(ref, () => ({ getFilterCheckList }), [JSON.stringify(checkList)]);

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

  const dataSource = isSearching ? searchList : checkList;

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
          data={dataSource}
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

const ForwardCommonLeft = memo(forwardRef(CommonLeft));

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
  const { currentRolevel, currentMemberInGroup } = useCurrentMemberRole();
  const { fetchState, searchMember, getMemberData, resetState } = useGroupMembers({
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
    if (!isSearching) {
      getMemberData();
    } else {
      searchMember(REACH_SEARCH_FLAG);
    }
  };

  const isDisabled = (member: GroupMemberItem) => {
    if (member.userID === currentMemberInGroup?.userID) return true;
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
    <Spin wrapperClassName="h-full" spinning={fetchState.loading}>
      <Virtuoso
        className="h-full overflow-x-hidden"
        data={dataSource}
        fixedItemHeight={62}
        endReached={endReached}
        itemContent={(_, member) => (
          <CheckItem
            showCheck
            isChecked={isChecked(member)}
            disabled={isDisabled(member)}
            data={member}
            itemClick={checkClick}
          />
        )}
      />
    </Spin>
  );
};

const ForwardMemberList = memo(forwardRef(GroupMemberList));
