import { CloseOutlined } from "@ant-design/icons";
import { GroupType, SessionType } from "@openim/wasm-client-sdk";
import { CardElem } from "@openim/wasm-client-sdk/lib/types/entity";
import { Button, Input, Modal, Upload } from "antd";
import i18n, { t } from "i18next";
import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidV4 } from "uuid";

import { message } from "@/AntdGlobalComp";
import OIMAvatar from "@/components/OIMAvatar";
import { useConversationToggle } from "@/hooks/useConversationToggle";
import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import { IMSDK } from "@/layout/MainContentWrap";
import { feedbackToast } from "@/utils/common";

import ChooseBox, { ChooseBoxHandle } from "./ChooseBox";
import { CheckListItem } from "./ChooseBox/CheckItem";

export type ChooseModalType = "CRATE_GROUP" | "INVITE_TO_GROUP" | "KICK_FORM_GROUP";

export interface SelectUserExtraData {
  notConversation: boolean;
  list: CheckListItem[];
}

export interface ChooseModalState {
  type: ChooseModalType;
  extraData?: unknown;
}

interface IChooseModalProps {
  state: ChooseModalState;
}

const titleMap = {
  CRATE_GROUP: t("placeholder.createGroup"),
  INVITE_TO_GROUP: t("placeholder.invitation"),
  KICK_FORM_GROUP: t("placeholder.kickMember"),
};

i18n.on("languageChanged", () => {
  titleMap.CRATE_GROUP = t("placeholder.createGroup");
  titleMap.INVITE_TO_GROUP = t("placeholder.invitation");
  titleMap.KICK_FORM_GROUP = t("placeholder.kickMember");
});

const onlyMemberTypes = ["KICK_FORM_GROUP", "TRANSFER_IN_GROUP"];

const ChooseModal: ForwardRefRenderFunction<OverlayVisibleHandle, IChooseModalProps> = (
  { state: { type, extraData } },
  ref,
) => {
  const chooseBoxRef = useRef<ChooseBoxHandle>(null);
  const [loading, setLoading] = useState(false);
  const [groupBaseInfo, setGroupBaseInfo] = useState({
    groupName: "",
    groupAvatar: "",
  });

  const { toSpecifiedConversation } = useConversationToggle();
  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  useEffect(() => {
    if (isOverlayOpen && type === "CRATE_GROUP" && extraData) {
      setTimeout(
        () => chooseBoxRef.current?.updatePrevCheckList(extraData as CheckListItem[]),
        100,
      );
    }
    if (isOverlayOpen && extraData) {
      setTimeout(
        () =>
          chooseBoxRef.current?.updatePrevCheckList(
            (extraData as SelectUserExtraData).list,
          ),
        100,
      );
    }
  }, [isOverlayOpen]);

  const confirmChoose = async () => {
    const choosedList = chooseBoxRef.current?.getCheckedList() ?? [];
    if (!choosedList?.length) return message.warning(t("toast.selectLeastOne"));

    if (!groupBaseInfo.groupName && type === "CRATE_GROUP")
      return message.warning(t("toast.inputGroupName"));

    setLoading(true);
    try {
      switch (type) {
        case "CRATE_GROUP":
          if (choosedList.length === 1) {
            toSpecifiedConversation({
              sourceID: choosedList[0].userID!,
              sessionType: SessionType.Single,
            });
            break;
          }
          await IMSDK.createGroup({
            groupInfo: {
              groupType: GroupType.WorkingGroup,
              groupName: groupBaseInfo.groupName,
              faceURL: groupBaseInfo.groupAvatar,
            },
            memberUserIDs: choosedList.map((item) => item.userID!),
            adminUserIDs: [],
          });
          break;
        case "INVITE_TO_GROUP":
          await IMSDK.inviteUserToGroup({
            groupID: extraData as string,
            userIDList: choosedList.map((item) => item.userID!),
            reason: "",
          });
          break;
        case "KICK_FORM_GROUP":
          await IMSDK.kickGroupMember({
            groupID: extraData as string,
            userIDList: choosedList.map((item) => item.userID!),
            reason: "",
          });
          break;
        default:
          break;
      }
    } catch (error) {
      feedbackToast({ error });
    }
    setLoading(false);
    closeOverlay();
  };

  const resetState = () => {
    chooseBoxRef.current?.resetState();
    setGroupBaseInfo({
      groupName: "",
      groupAvatar: "",
    });
  };

  const customUpload = async ({ file }: { file: File }) => {
    try {
      const {
        data: { url },
      } = await IMSDK.uploadFile({
        name: file.name,
        contentType: file.type,
        uuid: uuidV4(),
        file,
      });
      setGroupBaseInfo((prev) => ({ ...prev, groupAvatar: url }));
    } catch (error) {
      feedbackToast({ error: t("toast.updateAvatarFailed") });
    }
  };

  const isCheckInGroup = type === "INVITE_TO_GROUP";

  return (
    <Modal
      title={null}
      footer={null}
      centered
      open={isOverlayOpen}
      closable={false}
      width={680}
      onCancel={closeOverlay}
      destroyOnClose
      styles={{
        mask: {
          opacity: 0,
          transition: "none",
        },
      }}
      afterClose={resetState}
      className="no-padding-modal max-w-[80vw]"
      maskTransitionName=""
    >
      <div>
        <div className="app-no-drag flex h-16 items-center justify-between bg-[var(--gap-text)] px-7">
          <div>{titleMap[type]}</div>
          <CloseOutlined
            className="cursor-pointer text-[#8e9ab0]"
            rev={undefined}
            onClick={closeOverlay}
          />
        </div>
        {type === "CRATE_GROUP" ? (
          <div className="px-6 pt-4">
            <div className="mb-6 flex items-center">
              <div className="min-w-[60px] font-medium">
                {t("placeholder.groupName")}
              </div>
              <Input
                placeholder={t("placeholder.pleaseEnter")}
                spellCheck={false}
                value={groupBaseInfo.groupName}
                onChange={(e) =>
                  setGroupBaseInfo((state) => ({ ...state, groupName: e.target.value }))
                }
              />
            </div>
            <div className="mb-6 flex items-center">
              <div className="min-w-[60px] font-medium">
                {t("placeholder.groupAvatar")}
              </div>
              <div className="flex items-center">
                <OIMAvatar src={groupBaseInfo.groupAvatar} isgroup />
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  customRequest={customUpload as any}
                >
                  <span className="ml-3 cursor-pointer text-xs text-[var(--primary)]">
                    {t("placeholder.clickToModify")}
                  </span>
                </Upload>
              </div>
            </div>
            <div className="flex">
              <div className="min-w-[60px] font-medium">
                {t("placeholder.groupMember")}
              </div>
              <ChooseBox className="!m-0 !h-[40vh] flex-1" ref={chooseBoxRef} />
            </div>
          </div>
        ) : (
          <ChooseBox
            className="!h-[60vh]"
            ref={chooseBoxRef}
            isCheckInGroup={isCheckInGroup}
            showGroupMember={onlyMemberTypes.includes(type)}
            checkMemberRole={type === "KICK_FORM_GROUP"}
          />
        )}
        <div className="flex justify-end px-9 py-6">
          <Button
            className="mr-6 border-0 bg-[var(--chat-bubble)] px-6"
            onClick={closeOverlay}
          >
            {t("cancel")}
          </Button>
          <Button
            className="px-6"
            type="primary"
            loading={loading}
            onClick={confirmChoose}
          >
            {t("confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(forwardRef(ChooseModal));
