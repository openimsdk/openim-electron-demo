import { FriendUserItem, SelfUserInfo } from "@openim/wasm-client-sdk/lib/types/entity";
import { Tooltip } from "antd";
import { t } from "i18next";
import { memo } from "react";

import { modal } from "@/AntdGlobalComp";
import cancel from "@/assets/images/common/cancel.png";
import { IMSDK } from "@/layout/MainContentWrap";
import { feedbackToast } from "@/utils/common";

const CardActionRow = ({
  isFriend,
  cardInfo,
  closeOverlay,
}: {
  isFriend?: boolean;
  cardInfo?: Partial<SelfUserInfo & FriendUserItem>;
  closeOverlay: () => void;
}) => {
  const tryUnfriend = () => {
    modal.confirm({
      title: t("placeholder.unfriend"),
      content: t("toast.confirmUnfriend"),
      onOk: async () => {
        try {
          await IMSDK.deleteFriend(cardInfo!.userID!);
        } catch (error) {
          feedbackToast({ error, msg: t("toast.unfriendFailed") });
        }
      },
    });
    closeOverlay();
  };

  return (
    <div className="flex items-center">
      {isFriend && (
        <Tooltip title={t("placeholder.unfriend")} placement="bottom">
          <img
            className="cursor-pointer"
            width={18}
            src={cancel}
            alt=""
            onClick={tryUnfriend}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default memo(CardActionRow);
