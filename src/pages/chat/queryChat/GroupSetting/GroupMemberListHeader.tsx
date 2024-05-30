import { LeftOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { memo } from "react";

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
    </div>
  );
};

export default memo(GroupMemberListHeader);
