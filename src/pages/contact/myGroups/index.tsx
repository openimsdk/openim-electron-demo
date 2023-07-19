import { Select } from "antd";
import { useCallback, useState } from "react";
import { Virtuoso } from "react-virtuoso";

import { useContactStore, useUserStore } from "@/store";
import emitter from "@/utils/events";
import { GroupItem } from "@/utils/open-im-sdk-wasm/types/entity";

import GroupListItem from "./GroupListItem";

export enum GroupTypeEnum {
  JoinedGroup,
  CreatedGroup,
}

export const MyGroups = () => {
  const [selectGroup, setSelectGroup] = useState(GroupTypeEnum.CreatedGroup);

  const joinedGroupList = useContactStore((state) => state.groupList);
  const { userID } = useUserStore((state) => state.selfInfo);

  const handleChange = (value: string) => {
    setSelectGroup(Number(value));
  };

  const filterGroup = joinedGroupList.filter((group) => {
    if (selectGroup === GroupTypeEnum.JoinedGroup) {
      return group.creatorUserID !== userID;
    } else if (selectGroup === GroupTypeEnum.CreatedGroup) {
      return group.creatorUserID === userID;
    }
    return false;
  });

  const showGroupCard = useCallback((group: GroupItem) => {
    emitter.emit("OPEN_GROUP_CARD", group);
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="m-5.5 flex flex-row justify-between">
        <p className="text-base font-extrabold">我的群组</p>
        <Select
          defaultValue={String(selectGroup)}
          popupClassName="p-0"
          style={{ width: 200 }}
          onChange={handleChange}
          options={[
            { value: String(GroupTypeEnum.CreatedGroup), label: "我创建的" },
            { value: String(GroupTypeEnum.JoinedGroup), label: "我加入的" },
          ]}
        />
      </div>
      <div className="box-border flex-1 overflow-y-auto px-2 pb-3">
        <Virtuoso
          className="h-full overflow-x-hidden"
          data={filterGroup}
          itemContent={(_, group) => (
            <GroupListItem
              key={group.groupID}
              source={group}
              showGroupCard={showGroupCard}
            />
          )}
        />
      </div>
    </div>
  );
};
