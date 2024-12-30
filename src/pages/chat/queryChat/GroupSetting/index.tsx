import { Drawer } from "antd";
import { t } from "i18next";
import { forwardRef, ForwardRefRenderFunction, memo, useRef, useState } from "react";

import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";

import GroupMemberList, { GroupMemberListHandle } from "./GroupMemberList";
import GroupMemberListHeader from "./GroupMemberListHeader";
import GroupSettings from "./GroupSettings";

const GroupSetting: ForwardRefRenderFunction<OverlayVisibleHandle, unknown> = (
  _,
  ref,
) => {
  const memberListRef = useRef<GroupMemberListHandle>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isPreviewMembers, setIsPreviewMembers] = useState(false);

  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  const searchMember = (keyword: string) => {
    memberListRef.current?.searchMember(keyword);
  };

  const updateSearching = (val: boolean) => {
    setIsSearching(val);
  };

  const closePreviewMembers = () => {
    setIsPreviewMembers(false);
    setIsSearching(false);
  };

  return (
    <Drawer
      title={
        !isPreviewMembers ? (
          t("placeholder.setting")
        ) : (
          <GroupMemberListHeader
            back2Settings={closePreviewMembers}
            searchMemebers={searchMember}
            updateSearching={updateSearching}
          />
        )
      }
      destroyOnClose
      placement="right"
      rootClassName="chat-drawer"
      onClose={closeOverlay}
      afterOpenChange={(visible) => {
        if (!visible) {
          closePreviewMembers();
        }
      }}
      open={isOverlayOpen}
      maskClassName="opacity-0"
      maskMotion={{
        visible: false,
      }}
      width={460}
      getContainer={"#chat-container"}
    >
      {!isPreviewMembers ? (
        <GroupSettings
          closeOverlay={closeOverlay}
          updateTravel={() => setIsPreviewMembers(true)}
        />
      ) : (
        <GroupMemberList ref={memberListRef} isSearching={isSearching} />
      )}
    </Drawer>
  );
};

export default memo(forwardRef(GroupSetting));
