import { Button, Divider } from "antd";
import dayjs from "dayjs";
import {
  FC,
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCopyToClipboard } from "react-use";

import { BusinessUserInfo, getBusinessUserInfo } from "@/api/login";
import DraggableModalWrap from "@/components/DraggableModalWrap";
import EditableContent from "@/components/EditableContent";
import OIMAvatar from "@/components/OIMAvatar";
import { useConversationToggle } from "@/hooks/useConversationToggle";
import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import { IMSDK } from "@/layout/MainContentWrap";
import { useUserStore } from "@/store";
import { feedbackToast } from "@/utils/common";
import {
  FriendUserItem,
  FullUserItem,
  GroupMemberItem,
} from "@/utils/open-im-sdk-wasm/types/entity";
import { GroupJoinSource, SessionType } from "@/utils/open-im-sdk-wasm/types/enum";

import EditSelfInfo from "./EditSelfInfo";
import SendRequest from "./SendRequest";

interface IUserCardModalProps {
  userID?: string;
  groupID?: string;
  isSelf?: boolean;
  notAdd?: boolean;
  cardInfo?: CardInfo;
}

export type CardInfo = Partial<BusinessUserInfo & FriendUserItem>;

const getGender = (gender: number) => {
  if (!gender) return "-";
  return gender === 1 ? "男" : "女";
};

const UserCardModal: ForwardRefRenderFunction<
  OverlayVisibleHandle,
  IUserCardModalProps
> = (props, ref) => {
  const { userID, groupID, isSelf, notAdd } = props;

  const editInfoRef = useRef<OverlayVisibleHandle>(null);
  const [cardInfo, setCardInfo] = useState<CardInfo>();
  const [isSendRequest, setIsSendRequest] = useState(false);
  const [userFields, setUserFields] = useState<FieldRow[]>([]);
  const [gorupMemberFields, setGorupMemberFields] = useState<FieldRow[]>([]);

  const selfInfo = useUserStore((state) => state.selfInfo);

  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);
  const { toSpecifiedConversation } = useConversationToggle();
  const [_, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (Object.keys(props).length < 1) return;
    refreshData();
  }, [isSelf, userID, groupID, props.cardInfo?.userID]);

  const refreshSelfInfo = useCallback(() => {
    const latestInfo = useUserStore.getState().selfInfo;
    setCardInfo(latestInfo);
    setUserInfoRow(latestInfo);
  }, [isSelf]);

  const refreshData = async () => {
    getGroupMemberInfo();
    const tmpCardInfo = props.cardInfo ?? (await getCardInfo());
    if (!tmpCardInfo) {
      feedbackToast({ error: "Get user card info data failed!" });
      closeOverlay();
      return;
    }

    setCardInfo(tmpCardInfo);
    setUserInfoRow(tmpCardInfo);
  };

  const updateCardRemark = (remark: string) => {
    setUserInfoRow({ ...cardInfo!, remark });
  };

  const getCardInfo = async (): Promise<CardInfo | null> => {
    if (isSelf) {
      return selfInfo;
    }
    const {
      data: { users },
    } = await getBusinessUserInfo([userID!]);
    const { data } = await IMSDK.getUsersInfo<FullUserItem[]>([userID!]);
    return {
      ...data[0]?.friendInfo,
      ...users[0],
    };
  };

  const getGroupMemberInfo = async () => {
    if (!groupID || !userID) {
      if (gorupMemberFields.length > 0) {
        setGorupMemberFields([]);
      }
      return;
    }

    const { data } = await IMSDK.getSpecifiedGroupMembersInfo<GroupMemberItem[]>({
      groupID,
      userIDList: [userID],
    });
    const memebrInfo = data[0];
    if (memebrInfo) {
      setGroupMemberInfoRow(memebrInfo);
    }
  };

  const setUserInfoRow = (info: CardInfo) => {
    let tmpFields = [] as FieldRow[];
    tmpFields.push({
      title: "昵称",
      value: info.nickname || "",
    });
    const isFriend = info?.remark !== undefined;

    if (isFriend) {
      tmpFields.push({
        title: "备注",
        value: info.remark || "-",
        editable: true,
      });
    }
    if (isFriend || isSelf) {
      tmpFields = [
        ...tmpFields,
        ...[
          {
            title: "性别",
            value: getGender(info.gender!),
          },
          {
            title: "生日",
            value: info.birth ? dayjs(info.birth).format("YYYY年M月D日") : "-",
          },
          {
            title: "手机号",
            value: info.phoneNumber || "-",
          },
        ],
      ];
    }
    setUserFields(tmpFields);
  };

  const setGroupMemberInfoRow = async (info: GroupMemberItem) => {
    let joinSourceStr = "-";
    if (info.joinSource === GroupJoinSource.Invitation) {
      const { data } = await IMSDK.getSpecifiedGroupMembersInfo<GroupMemberItem[]>({
        groupID: groupID!,
        userIDList: [info.inviterUserID],
      });
      const inviterInfo = data[0];
      joinSourceStr = `${inviterInfo?.nickname ?? ""}邀请入群`;
    } else {
      joinSourceStr =
        info.joinSource === GroupJoinSource.QrCode ? "扫码入群" : "搜索群组ID";
    }
    setGorupMemberFields([
      {
        title: "群昵称",
        value: info.nickname,
      },
      {
        title: "入群时间",
        value: dayjs(info.joinTime).format("YYYY年M月D日"),
      },
      {
        title: "入群方式",
        value: joinSourceStr,
      },
    ]);
  };

  const backToCard = () => {
    setIsSendRequest(false);
  };

  const isFriend = cardInfo?.remark !== undefined;
  const showAddFriend = !isFriend && !isSelf && !notAdd;
  const showSendMessage = !isSelf;

  return (
    <DraggableModalWrap
      title={null}
      footer={null}
      open={isOverlayOpen}
      closable={false}
      width={332}
      centered
      onCancel={closeOverlay}
      destroyOnClose
      maskStyle={{
        opacity: 0,
        transition: "none",
      }}
      ignoreClasses=".ignore-drag, .no-padding-modal, .cursor-pointer"
      className="no-padding-modal"
      maskTransitionName=""
    >
      {isSendRequest ? (
        <SendRequest cardInfo={cardInfo!} backToCard={backToCard} />
      ) : (
        <div className="flex max-h-[520px] min-h-[484px] flex-col overflow-hidden bg-[url(@/assets/images/common/card_bg.png)] bg-[length:332px_134px] bg-no-repeat px-5.5">
          <div className="h-[104px] min-h-[104px] w-full cursor-move" />
          <div className="ignore-drag flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center">
              <OIMAvatar size={60} src={cardInfo?.faceURL} text={cardInfo?.nickname} />
              <div className="ml-3 flex h-[60px] flex-1 flex-col justify-around overflow-hidden">
                <div className="flex w-fit max-w-[80%] items-baseline">
                  <div
                    className="flex-1 truncate text-base font-medium text-white"
                    title={cardInfo?.nickname}
                  >
                    {cardInfo?.nickname}
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className="mr-3 cursor-pointer text-xs text-[var(--sub-text)]"
                    onClick={() => {
                      copyToClipboard(cardInfo?.userID ?? "");
                      feedbackToast({ msg: "复制成功！" });
                    }}
                  >
                    {cardInfo?.userID}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <UserCardDataGroup
                title="个人信息"
                userID={cardInfo?.userID}
                fieldRows={userFields}
                updateCardRemark={updateCardRemark}
              />
            </div>
          </div>
          <div className="mx-1 mb-6 mt-3 flex items-center gap-6">
            {showAddFriend && (
              <Button
                type="primary"
                className="flex-1"
                onClick={() => setIsSendRequest(true)}
              >
                添加好友
              </Button>
            )}
            {isSelf && (
              <Button
                type="primary"
                className="flex-1"
                onClick={() => editInfoRef.current?.openOverlay()}
              >
                编辑资料
              </Button>
            )}
            {showSendMessage && (
              <Button
                type="primary"
                className="flex-1"
                onClick={() =>
                  toSpecifiedConversation({
                    sourceID: userID!,
                    sessionType: SessionType.Single,
                  }).then(closeOverlay)
                }
              >
                发消息
              </Button>
            )}
          </div>
        </div>
      )}

      <EditSelfInfo ref={editInfoRef} refreshSelfInfo={refreshSelfInfo} />
    </DraggableModalWrap>
  );
};

export default memo(forwardRef(UserCardModal));

interface IUserCardDataGroupProps {
  title: string;
  userID?: string;
  fieldRows: FieldRow[];
  updateCardRemark?: (remark: string) => void;
}

type FieldRow = {
  title: string;
  value: string;
  editable?: boolean;
};

const UserCardDataGroup: FC<IUserCardDataGroupProps> = ({
  title,
  userID,
  fieldRows,
  updateCardRemark,
}) => {
  const tryUpdateRemark = async (remark: string) => {
    try {
      await IMSDK.setFriendRemark({
        toUserID: userID!,
        remark,
      });
      updateCardRemark?.(remark);
    } catch (error) {
      feedbackToast({ error });
    }
  };
  return (
    <div>
      <div className="my-4 text-[var(--sub-text)]">{title}</div>
      {fieldRows.map((fieldRow, idx) => (
        <div className="my-4 flex items-center text-xs" key={idx}>
          <div className="w-16 text-[var(--sub-text)]">{fieldRow.title}</div>
          {fieldRow.editable ? (
            <EditableContent
              className="!ml-0"
              textClassName="font-medium"
              value={fieldRow.value}
              editable={true}
              onChange={tryUpdateRemark}
            />
          ) : (
            <div className="flex-1 truncate">{fieldRow.value}</div>
          )}
        </div>
      ))}

      <Divider className="my-0 border-[var(--gap-text)]" />
    </div>
  );
};
