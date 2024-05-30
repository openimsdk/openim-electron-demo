import { RightOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import { t } from "i18next";
import { memo } from "react";

import OIMAvatar from "@/components/OIMAvatar";
import SettingRow from "@/components/SettingRow";
import { useConversationSettings } from "@/hooks/useConversationSettings";
import { useCurrentMemberRole } from "@/hooks/useCurrentMemberRole";

import GroupMemberRow from "./GroupMemberRow";
import { useGroupSettings } from "./useGroupSettings";

const GroupSettings = ({
  updateTravel,
  closeOverlay,
}: {
  updateTravel: () => void;
  closeOverlay: () => void;
}) => {
  const { isNomal, isJoinGroup } = useCurrentMemberRole();

  const { currentConversation, updateConversationPin, clearConversationMessages } =
    useConversationSettings();

  const { currentGroupInfo, tryQuitGroup } = useGroupSettings({ closeOverlay });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-4">
        <div className="flex items-center">
          <div className="relative">
            <OIMAvatar
              isgroup
              src={currentGroupInfo?.faceURL}
              text={currentGroupInfo?.groupName}
            />
          </div>

          <div className="mr-1 max-w-[240px] truncate font-medium">
            {currentGroupInfo?.groupName}
          </div>
        </div>
      </div>

      <Divider className="m-0 border-4 border-[#F4F5F7]" />
      {currentGroupInfo && isJoinGroup && (
        <GroupMemberRow
          currentGroupInfo={currentGroupInfo}
          isNomal={isNomal}
          updateTravel={updateTravel}
        />
      )}
      <Divider className="m-0 border-4 border-[#F4F5F7]" />

      <Divider className="m-0 border-4 border-[#F4F5F7]" />
      <SettingRow className="pb-2" title={`${t("placeholder.group")}ID`}>
        <div className="flex items-center">
          <span className="mr-1 text-xs text-[var(--sub-text)]">
            {currentGroupInfo?.groupID}
          </span>
        </div>
      </SettingRow>
      <SettingRow title={t("placeholder.groupTppe")}>
        <span className="text-xs text-[var(--sub-text)]">
          {t("placeholder.workGroup")}
        </span>
      </SettingRow>
      <Divider className="m-0 border-4 border-[#F4F5F7]" />

      <SettingRow
        hidden={!isJoinGroup}
        className="pb-2"
        title={t("placeholder.sticky")}
        value={currentConversation?.isPinned}
        tryChange={updateConversationPin}
      />
      <SettingRow
        className="cursor-pointer"
        title={t("toast.clearChatHistory")}
        rowClick={clearConversationMessages}
      >
        <RightOutlined rev={undefined} />
      </SettingRow>

      <div className="flex-1" />
      {isJoinGroup && (
        <div className="flex w-full justify-center pb-3 pt-24">
          <Button type="primary" danger ghost onClick={tryQuitGroup}>
            {t("placeholder.exitGroup")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(GroupSettings);
