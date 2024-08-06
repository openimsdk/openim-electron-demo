import { ApplicationHandleResult } from "@openim/wasm-client-sdk";
import {
  FriendApplicationItem,
  GroupApplicationItem,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { Button, Spin } from "antd";
import { t } from "i18next";
import { memo, useCallback, useState } from "react";

import arrow from "@/assets/images/contact/arrowTopRight.png";
import OIMAvatar from "@/components/OIMAvatar";
import { IMSDK } from "@/layout/MainContentWrap";
import emitter from "@/utils/events";

type ApplicationItemSource = FriendApplicationItem & GroupApplicationItem;

export type AccessFunction = (source: Partial<ApplicationItemSource>) => Promise<void>;

const ApplicationItem = ({
  currentUserID,
  source,
  onAccept,
  onReject,
}: {
  source: Partial<ApplicationItemSource>;
  currentUserID: string;
  onAccept: AccessFunction;
  onReject: AccessFunction;
}) => {
  const [loading, setLoading] = useState(false);
  const isRecv = source.userID !== currentUserID && source.fromUserID !== currentUserID;
  const isGroup = Boolean(source.groupID);
  const showActionBtn = source.handleResult === 0 && isRecv;

  const getApplicationDesc = () => {
    if (isGroup) {
      return t("application.applyToJoin");
    }
    return t(isRecv ? "application.applyToFriend" : "application.applyToAdd");
  };

  const getTitle = () => {
    if (isGroup) {
      return isRecv ? source.nickname : source.groupName;
    }
    return isRecv ? source.fromNickname : source.toNickname;
  };

  const getStatusStr = () => {
    if (source.handleResult === ApplicationHandleResult.Agree) {
      return t("application.agreed");
    }
    if (source.handleResult === ApplicationHandleResult.Reject) {
      return t("application.refused");
    }
    return t("application.pending");
  };

  const getAvatarUrl = () => {
    if (isGroup) {
      return isRecv ? source.userFaceURL : source.groupFaceURL;
    }
    return isRecv ? source.fromFaceURL : source.toFaceURL;
  };

  const loadingWrap = async (isAgree: boolean) => {
    setLoading(true);
    await (isAgree ? onAccept(source) : onReject(source));
    setLoading(false);
  };

  const tryShowCard = useCallback(async () => {
    if (isGroup) {
      const { data } = await IMSDK.getSpecifiedGroupsInfo([source.groupID!]);
      emitter.emit("OPEN_GROUP_CARD", data[0]);
      return;
    }
    window.userClick(isRecv ? source.fromUserID : source.toUserID);
  }, []);

  return (
    <Spin spinning={loading}>
      <div className="flex flex-row items-center justify-between p-3.5 transition-colors hover:bg-[var(--primary-active)]">
        <div className="flex flex-row">
          <OIMAvatar
            src={getAvatarUrl()}
            text={getTitle()}
            isgroup={isGroup}
            onClick={tryShowCard}
          />
          <div className="ml-3">
            <p className="text-sm">{getTitle()}</p>
            <p className="pb-2.5 pt-[5px] text-xs ">
              {getApplicationDesc()}
              {(isGroup || (!isGroup && !isRecv)) && (
                <span className="ml-1 text-xs text-[#0289FAFF]">
                  {source.groupName || source.toNickname}
                </span>
              )}
            </p>
            <p className="text-xs text-[var(--sub-text)]">
              {t("application.information")}:
            </p>
            <p className="text-xs text-[var(--sub-text)]">{source.reqMsg}</p>
          </div>
        </div>

        {showActionBtn && (
          <div className="flex flex-row">
            <div className="mr-5.5 h-8 w-[60px]">
              <Button
                block={true}
                size="small"
                onClick={() => loadingWrap(false)}
                className="!h-full !rounded-md border-2 border-[#0089FF] text-[#0089FF]"
              >
                {t("application.refuse")}
              </Button>
            </div>
            <div className="h-8 w-[60px]">
              <Button
                block={true}
                size="small"
                type="primary"
                className="!h-full !rounded-md bg-[#0289fa]"
                onClick={() => loadingWrap(true)}
              >
                {t("application.agree")}
              </Button>
            </div>
          </div>
        )}

        {!showActionBtn && (
          <div className="flex flex-row items-center">
            {!isRecv && <img className="mr-2 h-4 w-4" src={arrow} alt="" />}
            <p className="text-sm text-[var(--sub-text)]">{getStatusStr()}</p>
          </div>
        )}
      </div>
    </Spin>
  );
};

export default memo(ApplicationItem);
