import { Drawer } from "antd";
import { t } from "i18next";
import { forwardRef, ForwardRefRenderFunction, memo, useRef, useState } from "react";

import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";

import GroupMemberList from "./GroupMemberList";
import GroupMemberListHeader from "./GroupMemberListHeader";
import GroupSettings from "./GroupSettings";

const GroupSetting: ForwardRefRenderFunction<OverlayVisibleHandle, unknown> = (
  _,
  ref,
) => {
  const [isPreviewMembers, setIsPreviewMembers] = useState(false);

  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  const closePreviewMembers = () => {
    setIsPreviewMembers(false);
  };

  return (
    <Drawer
      title={
        !isPreviewMembers ? (
          t("placeholder.setting")
        ) : (
          <GroupMemberListHeader back2Settings={closePreviewMembers} />
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
        <GroupMemberList />
      )}
    </Drawer>
  );
};

export default memo(forwardRef(GroupSetting));
