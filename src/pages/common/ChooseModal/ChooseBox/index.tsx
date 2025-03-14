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
  FC,
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
import useGroupMembers from "@/hooks/useGroupMembers";
import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { useContactStore } from "@/store/contact";
import { feedbackToast } from "@/utils/common";

import CheckItem, { CheckListItem } from "./CheckItem";
import MenuItem from "./MenuItem";

const menuList = [
  {
    idx: 0,
    title: t("placeholder.myFriend"),
    icon: friend,
  },
];

i18n.on("languageChanged", () => {
  menuList[0].title = t("placeholder.myFriend");
});

export type ChooseMenuItem = (typeof menuList)[0];

interface IChooseBoxProps {
  className?: string;
  isCheckInGroup?: boolean;
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
  const { className, isCheckInGroup, showGroupMember, chooseOneOnly, checkMemberRole } =
    props;

  const [checkedList, setCheckedList] = useState<CheckListItem[]>([]);
  const latestCheckedList = useLatest(checkedList);

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
        <div className="py-3 pb-3" />

        {showGroupMember ? (
          <ForwardMemberList
            isChecked={isChecked}
            checkClick={checkClick}
            checkMemberRole={checkMemberRole}
          />
        ) : (
          <ForwardCommonLeft
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

const CommonLeft: FC<ICommonLeftProps> = ({
  isCheckInGroup,
  checkClick,
  isChecked,
}) => {
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
        {menuList.map((menu) => (
          <MenuItem menu={menu} key={menu.idx} menuClick={menuClick} />
        ))}
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

const ForwardCommonLeft = memo(CommonLeft);

interface IGroupMemberListProps {
  checkMemberRole?: boolean;
  checkClick: (data: CheckListItem) => void;
  isChecked: (data: CheckListItem) => boolean;
}

const GroupMemberList: FC<IGroupMemberListProps> = ({
  checkMemberRole,
  checkClick,
  isChecked,
}) => {
  const { currentRolevel, currentMemberInGroup } = useCurrentMemberRole();
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
    if (fetchState.loading || !fetchState.hasMore) {
      return;
    }
    getMemberData();
  };

  const isDisabled = (member: GroupMemberItem) => {
    if (member.userID === currentMemberInGroup?.userID) return true;
    if (!checkMemberRole) return false;
    return member.roleLevel >= currentRolevel;
  };

  return (
    <Spin wrapperClassName="h-full" spinning={fetchState.loading}>
      <Virtuoso
        className="h-full overflow-x-hidden"
        data={fetchState.groupMemberList}
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

const ForwardMemberList = memo(GroupMemberList);
