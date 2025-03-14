import { CbEvents } from "@openim/wasm-client-sdk";
import { SessionType } from "@openim/wasm-client-sdk";
import {
  FriendUserItem,
  GroupMemberItem,
  WSEvent,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { useLatest } from "ahooks";
import { Button, Divider, Spin } from "antd";
import dayjs from "dayjs";
import { t } from "i18next";
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
import { useQuery } from "react-query";
import { useCopyToClipboard } from "react-use";

import { BusinessUserInfo, getBusinessUserInfo } from "@/api/login";
import DraggableModalWrap from "@/components/DraggableModalWrap";
import EditableContent from "@/components/EditableContent";
import OIMAvatar from "@/components/OIMAvatar";
import { useConversationToggle } from "@/hooks/useConversationToggle";
import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import { IMSDK } from "@/layout/MainContentWrap";
import { useContactStore, useUserStore } from "@/store";
import { feedbackToast } from "@/utils/common";

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
  return gender === 1 ? t("placeholder.man") : t("placeholder.female");
};

const UserCardModal: ForwardRefRenderFunction<
  OverlayVisibleHandle,
  IUserCardModalProps
> = (props, ref) => {
  const { userID, isSelf, notAdd } = props;

  const editInfoRef = useRef<OverlayVisibleHandle>(null);
  const [cardInfo, setCardInfo] = useState<CardInfo>();
  const [isSendRequest, setIsSendRequest] = useState(false);
  const [userFields, setUserFields] = useState<FieldRow[]>([]);

  const selfInfo = useUserStore((state) => state.selfInfo);
  const isFriendUser = useContactStore(
    (state) => state.friendList.findIndex((item) => item.userID === userID) !== -1,
  );

  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);
  const { toSpecifiedConversation } = useConversationToggle();
  const [_, copyToClipboard] = useCopyToClipboard();

  const getCardInfo = async (): Promise<{
    cardInfo: CardInfo;
    memberInfo?: GroupMemberItem | null;
  }> => {
    if (isSelf) {
      return {
        cardInfo: selfInfo,
      };
    }
    let userInfo: CardInfo | null = null;
    const friendInfo = useContactStore
      .getState()
      .friendList.find((item) => item.userID === userID);
    if (friendInfo) {
      userInfo = { ...friendInfo };
    } else {
      const { data } = await IMSDK.getUsersInfo([userID!]);
      userInfo = { ...(data[0] ?? {}) };
    }

    try {
      const {
        data: { users },
      } = await getBusinessUserInfo([userID!]);
      userInfo = { ...userInfo, ...users[0] };
    } catch (error) {
      console.error("get business user info failed", userID, error);
    }
    return {
      cardInfo: userInfo,
    };
  };

  const refreshData = (data?: { cardInfo: CardInfo | null }) => {
    if (!data) {
      return;
    }
    const { cardInfo } = data;

    setCardInfo(cardInfo!);
    setUserInfoRow(cardInfo!);
  };

  const {
    data: fullCardInfo,
    isLoading,
    refetch,
  } = useQuery(["userInfo", userID], getCardInfo, {
    enabled: isOverlayOpen && Boolean(userID),
    onSuccess: refreshData,
  });

  const latestFullCardInfo = useLatest(fullCardInfo);

  useEffect(() => {
    if (!isOverlayOpen) return;
    const friendAddedHandler = ({ data }: WSEvent<FriendUserItem>) => {
      if (data.userID === userID) {
        refetch();
      }
    };
    IMSDK.on(CbEvents.OnFriendAdded, friendAddedHandler);
    refreshData(
      props.cardInfo ? { cardInfo: props.cardInfo } : latestFullCardInfo.current,
    );
    return () => {
      IMSDK.off(CbEvents.OnFriendAdded, friendAddedHandler);
    };
  }, [isOverlayOpen, props.cardInfo]);

  const refreshSelfInfo = useCallback(() => {
    const latestInfo = useUserStore.getState().selfInfo;
    setCardInfo(latestInfo);
    setUserInfoRow(latestInfo);
  }, [isSelf]);

  const updateCardRemark = (remark: string) => {
    setUserInfoRow({ ...cardInfo!, remark });
  };
  const setUserInfoRow = (info: CardInfo) => {
    let tmpFields = [] as FieldRow[];
    tmpFields.push({
      title: t("placeholder.nickName"),
      value: info.nickname || "",
    });
    const isFriend = info?.remark !== undefined;

    if (isFriend) {
      tmpFields.push({
        title: t("placeholder.remark"),
        value: info.remark || "-",
        editable: true,
      });
    }
    if (isFriend || isSelf) {
      tmpFields = [
        ...tmpFields,
        ...[
          {
            title: t("placeholder.gender"),
            value: getGender(info.gender!),
          },
          {
            title: t("placeholder.birth"),
            value: info.birth ? dayjs(info.birth).format("YYYY/M/D") : "-",
          },
          {
            title: t("placeholder.phoneNumber"),
            value: info.phoneNumber || "-",
          },
          {
            title: t("placeholder.email"),
            value: info.email || "-",
          },
        ],
      ];
    }
    setUserFields(tmpFields);
  };

  const backToCard = () => {
    setIsSendRequest(false);
  };

  const trySendRequest = () => {
    setIsSendRequest(true);
  };

  const resetState = () => {
    setCardInfo(undefined);
    setUserFields([]);
    setIsSendRequest(false);
  };

  const showAddFriend = !isFriendUser && !isSelf && !notAdd;

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
      styles={{
        mask: {
          opacity: 0,
          transition: "none",
        },
      }}
      afterClose={resetState}
      ignoreClasses=".ignore-drag, .no-padding-modal, .cursor-pointer"
      className="no-padding-modal"
      maskTransitionName=""
    >
      <Spin spinning={isLoading}>
        {isSendRequest ? (
          <SendRequest cardInfo={cardInfo!} backToCard={backToCard} />
        ) : (
          <div className="flex max-h-[520px] min-h-[484px] flex-col overflow-hidden bg-[url(@/assets/images/common/card_bg.png)] bg-[length:332px_134px] bg-no-repeat px-5.5">
            <div className="h-[104px] min-h-[104px] w-full cursor-move" />
            <div className="ignore-drag flex flex-1 flex-col overflow-hidden">
              <div className="flex items-center">
                <OIMAvatar
                  size={60}
                  src={cardInfo?.faceURL}
                  text={cardInfo?.nickname}
                />
                <div className="ml-3 flex h-[60px] flex-1 flex-col justify-around overflow-hidden">
                  <div className="flex w-fit max-w-[80%] items-baseline">
                    <div
                      className="flex-1 select-text truncate text-base font-medium text-white"
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
                        feedbackToast({ msg: t("toast.copySuccess") });
                      }}
                    >
                      {cardInfo?.userID}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <UserCardDataGroup
                  title={t("placeholder.personalInfo")}
                  userID={cardInfo?.userID}
                  fieldRows={userFields}
                  updateCardRemark={updateCardRemark}
                />
              </div>
            </div>
            <div className="mx-1 mb-6 mt-3 flex items-center gap-6">
              {showAddFriend && (
                <Button type="primary" className="flex-1" onClick={trySendRequest}>
                  {t("placeholder.addFriends")}
                </Button>
              )}
              {isSelf && (
                <Button
                  type="primary"
                  className="flex-1"
                  onClick={() => editInfoRef.current?.openOverlay()}
                >
                  {t("placeholder.editInfo")}
                </Button>
              )}
              {!isSelf && (
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
                  {t("placeholder.sendMessage")}
                </Button>
              )}
            </div>
          </div>
        )}
      </Spin>
      <EditSelfInfo ref={editInfoRef} refreshSelfInfo={refreshSelfInfo} />
    </DraggableModalWrap>
  );
};

export default memo(forwardRef(UserCardModal));

interface IUserCardDataGroupProps {
  title: string;
  userID?: string;
  divider?: boolean;
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
  divider,
  fieldRows,
  updateCardRemark,
}) => {
  const tryUpdateRemark = async (remark: string) => {
    try {
      await IMSDK.updateFriends({
        friendUserIDs: [userID!],
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
          <div className="w-24 text-[var(--sub-text)]">{fieldRow.title}</div>
          {fieldRow.editable ? (
            <EditableContent
              className="!ml-0"
              textClassName="font-medium"
              value={fieldRow.value}
              editable={true}
              onChange={tryUpdateRemark}
            />
          ) : (
            <div className="flex-1 select-text truncate">{fieldRow.value}</div>
          )}
        </div>
      ))}

      {divider && <Divider className="my-0 border-[var(--gap-text)]" />}
    </div>
  );
};
