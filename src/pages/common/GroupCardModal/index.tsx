import { LeftOutlined } from "@ant-design/icons";
import { GroupJoinSource, SessionType } from "@openim/wasm-client-sdk";
import { GroupItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { useRequest } from "ahooks";
import { Button, Input } from "antd";
import dayjs from "dayjs";
import { t } from "i18next";
import { forwardRef, ForwardRefRenderFunction, memo, useEffect, useState } from "react";

import clock from "@/assets/images/common/clock.png";
import member_etc from "@/assets/images/common/member_etc.png";
import DraggableModalWrap from "@/components/DraggableModalWrap";
import OIMAvatar from "@/components/OIMAvatar";
import { useConversationToggle } from "@/hooks/useConversationToggle";
import useGroupMembers from "@/hooks/useGroupMembers";
import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import { IMSDK } from "@/layout/MainContentWrap";
import { feedbackToast } from "@/utils/common";

interface IGroupCardModalProps {
  groupData?: GroupItem & { inGroup?: boolean };
}

const GroupCardModal: ForwardRefRenderFunction<
  OverlayVisibleHandle,
  IGroupCardModalProps
> = ({ groupData }, ref) => {
  const [reqMsg, setReqMsg] = useState("");
  const [isSendRequest, setIsSendRequest] = useState(false);

  const { fetchState, getMemberData, resetState } = useGroupMembers({
    groupID: groupData?.groupID,
  });

  const { toSpecifiedConversation } = useConversationToggle();
  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  const { runAsync, loading } = useRequest(IMSDK.joinGroup, {
    manual: true,
  });

  useEffect(() => {
    if (isOverlayOpen) {
      getMemberData(true);
    }
  }, [isOverlayOpen]);

  const createTimeStr = dayjs(groupData?.createTime ?? 0).format("YYYY/M/D");

  const sliceNum = groupData?.memberCount === 8 ? 8 : 7;
  const renderList = fetchState.groupMemberList.slice(0, sliceNum);

  const joinOrSendMessage = () => {
    if (groupData?.inGroup) {
      toSpecifiedConversation({
        sourceID: groupData.groupID,
        sessionType: SessionType.WorkingGroup,
      });
      closeOverlay();
      return;
    }

    setIsSendRequest(true);
  };

  const sendApplication = async () => {
    try {
      await runAsync({
        groupID: groupData!.groupID,
        reqMsg,
        joinSource: GroupJoinSource.Search,
      });
      feedbackToast({ msg: t("toast.sendJoinGroupRequestSuccess") });
      setIsSendRequest(false);
    } catch (error) {
      feedbackToast({ error, msg: t("toast.sendApplicationFailed") });
    }
  };

  return (
    <DraggableModalWrap
      title={null}
      footer={null}
      open={isOverlayOpen}
      closable={false}
      width={484}
      onCancel={closeOverlay}
      afterClose={resetState}
      destroyOnClose
      styles={{
        mask: {
          opacity: 0,
          transition: "none",
        },
      }}
      ignoreClasses=".ignore-drag, .no-padding-modal, .cursor-pointer"
      className="no-padding-modal"
      maskTransitionName=""
    >
      <div>
        {isSendRequest && (
          <div
            className="flex w-fit cursor-pointer items-center pl-5.5 pt-5.5"
            onClick={() => setIsSendRequest(false)}
          >
            <LeftOutlined rev={undefined} />
            <div className="ml-1 font-medium">{t("placeholder.groupVerification")}</div>
          </div>
        )}
        <div className="flex p-5.5">
          <OIMAvatar size={60} src={groupData?.faceURL} isgroup />
          <div className="ml-3">
            <div className="mb-3 max-w-[120px] truncate text-base font-medium">
              {groupData?.groupName}
            </div>
            <div className="flex items-center">
              <div className="text-xs text-[var(--sub-text)]">{`ID：${groupData?.groupID}`}</div>
              <div className="ml-4 flex items-center">
                <img src={clock} width={10} alt="" />
                <div className="text-xs text-[var(--sub-text)]">{createTimeStr}</div>
              </div>
            </div>
          </div>
        </div>
        {isSendRequest ? (
          <div className="mx-5.5">
            <div className="text-xs text-[var(--sub-text)]">
              {t("application.information")}
            </div>
            <div className="mt-3">
              <Input.TextArea
                showCount
                value={reqMsg}
                maxLength={50}
                bordered={false}
                spellCheck={false}
                placeholder={t("placeholder.pleaseEnter")}
                style={{ padding: "8px 6px" }}
                autoSize={{ minRows: 4, maxRows: 4 }}
                onChange={(e) => setReqMsg(e.target.value)}
                className="bg-[var(--chat-bubble)] hover:bg-[var(--chat-bubble)]"
              />
            </div>
            <div className="my-6 flex justify-center">
              <Button
                className="w-[60%]"
                type="primary"
                loading={loading}
                onClick={sendApplication}
              >
                {t("placeholder.send")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-[#F2F8FF] p-5.5">
            <div className="mb-3">{`${t("placeholder.groupMember")}：${
              groupData?.memberCount
            }`}</div>
            <div className="flex items-center">
              {renderList.map((item) => (
                <OIMAvatar
                  className="mr-3"
                  src={item.faceURL}
                  text={item.nickname}
                  key={item.userID}
                />
              ))}
              {renderList.length === 7 && <OIMAvatar src={member_etc} />}
            </div>
            <div className="mt-28 flex justify-center">
              <Button
                className="w-[60%]"
                type="primary"
                loading={loading}
                onClick={joinOrSendMessage}
              >
                {groupData?.inGroup
                  ? t("placeholder.sendMessage")
                  : t("placeholder.addGroup")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DraggableModalWrap>
  );
};

export default memo(forwardRef(GroupCardModal));
