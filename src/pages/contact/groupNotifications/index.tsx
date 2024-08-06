import { GroupApplicationItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Virtuoso } from "react-virtuoso";

import ApplicationItem, { AccessFunction } from "@/components/ApplicationItem";
import { IMSDK } from "@/layout/MainContentWrap";
import { useUserStore } from "@/store";
import { useContactStore } from "@/store/contact";
import { feedbackToast } from "@/utils/common";

export const GroupNotifications = () => {
  const { t } = useTranslation();
  const currentUserID = useUserStore((state) => state.selfInfo.userID);

  const recvGroupApplicationList = useContactStore(
    (state) => state.recvGroupApplicationList,
  );
  const sendGroupApplicationList = useContactStore(
    (state) => state.sendGroupApplicationList,
  );

  const groupApplicationList = sortArray(
    recvGroupApplicationList.concat(sendGroupApplicationList),
  );

  const onAccept = useCallback(async (application: GroupApplicationItem) => {
    try {
      await IMSDK.acceptGroupApplication({
        groupID: application.groupID,
        fromUserID: application.userID,
        handleMsg: "",
      });
    } catch (error) {
      feedbackToast({ error });
    }
  }, []);

  const onReject = useCallback(async (application: GroupApplicationItem) => {
    try {
      await IMSDK.refuseGroupApplication({
        groupID: application.groupID,
        fromUserID: application.userID,
        handleMsg: "",
      });
    } catch (error) {
      feedbackToast({ error });
    }
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <p className="m-5.5 text-base font-extrabold">
        {t("placeholder.groupNotification")}
      </p>
      <div className="flex-1 pb-3">
        <Virtuoso
          className="h-full overflow-x-hidden"
          data={groupApplicationList}
          itemContent={(_, item) => (
            <ApplicationItem
              key={`${item.userID}${item.reqTime}`}
              source={item}
              currentUserID={currentUserID}
              onAccept={onAccept as AccessFunction}
              onReject={onReject as AccessFunction}
            />
          )}
        />
      </div>
    </div>
  );
};

const sortArray = (list: GroupApplicationItem[]) => {
  list.sort((a, b) => {
    if (a.handleResult === 0 && b.handleResult === 0) {
      return b.reqTime - a.reqTime;
    } else if (a.handleResult === 0) {
      return -1;
    } else if (b.handleResult === 0) {
      return 1;
    }
    return 0;
  });
  return list;
};
