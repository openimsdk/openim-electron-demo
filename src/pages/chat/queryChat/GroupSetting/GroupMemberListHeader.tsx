import { LeftOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { memo } from "react";

import invite_header from "@/assets/images/chatSetting/invite_header.png";
import { useConversationStore } from "@/store";
import { emit } from "@/utils/events";

const GroupMemberListHeader = ({ back2Settings }: { back2Settings: () => void }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <LeftOutlined
          className="mr-2 !text-[var(--base-black)]"
          rev={undefined}
          onClick={back2Settings}
        />
        <div>{t("placeholder.memberList")}</div>
      </div>
      <div className="mr-4 flex items-center">
        <img
          className="mr-3 cursor-pointer"
          width={18}
          src={invite_header}
          alt=""
          onClick={() =>
            emit("OPEN_CHOOSE_MODAL", {
              type: "INVITE_TO_GROUP",
              extraData: useConversationStore.getState().currentConversation?.groupID,
            })
          }
        />
      </div>
    </div>
  );
};

export default memo(GroupMemberListHeader);
