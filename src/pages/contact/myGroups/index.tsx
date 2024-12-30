import { GroupItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { Select } from "antd";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Virtuoso } from "react-virtuoso";

import { useContactStore, useUserStore } from "@/store";
import { emit } from "@/utils/events";

import GroupListItem from "./GroupListItem";

export enum GroupTypeEnum {
  JoinedGroup,
  CreatedGroup,
}

export const MyGroups = () => {
  const { t } = useTranslation();
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
    emit("OPEN_GROUP_CARD", group);
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="m-5.5 flex flex-row justify-between">
        <p className="text-base font-extrabold">{t("placeholder.myGroup")}</p>
        <Select
          defaultValue={String(selectGroup)}
          popupClassName="p-0"
          style={{ width: 200 }}
          onChange={handleChange}
          options={[
            {
              value: String(GroupTypeEnum.CreatedGroup),
              label: t("placeholder.myCreated"),
            },
            {
              value: String(GroupTypeEnum.JoinedGroup),
              label: t("placeholder.myJoined"),
            },
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
