import { Button, Input, message, Modal, Upload } from "antd";
import { FC, useEffect } from "react";
import { MyAvatar } from "../../../components/MyAvatar";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { shallowEqual } from "@babel/types";
import { useReactive } from "ahooks";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { cosUpload, events, im } from "../../../utils";
import { SENDFORWARDMSG } from "../../../constants/events";
import { messageTypes } from "../../../constants/messageContentType";
import MultipleSelectBox, { SelectFriendItem, SelectGroupItem, SelectType, SelectMemberItem } from "./MultipleSelectBox";
import { useTranslation } from "react-i18next";
import { GroupMemberItem, Member } from "../../../utils/open_im_sdk/types";
import { getCosAuthorization } from "../../../utils/cos";

type GroupOpModalProps = {
  visible: boolean;
  modalType: ModalType;
  groupId?: string;
  groupMembers?: GroupMemberItem[];
  options?: string;
  close: () => void;
};

export type ModalType = "create" | "invite" | "remove" | "forward";

type RsType = {
  groupName: string;
  groupIcon: string;
  friendList: SelectFriendItem[];
  groupList: SelectGroupItem[];
  selectedList: SelectType[];
  memberList: SelectMemberItem[];
};

const GroupOpModal: FC<GroupOpModalProps> = ({ visible, options, modalType, groupId, groupMembers, close }) => {
  const selfID = useSelector((state: RootState) => state.user.selfInfo.userID);
  const friendList = useSelector((state: RootState) => state.contacts.friendList, shallowEqual);
  const groupList = useSelector((state: RootState) => state.contacts.groupList, shallowEqual);
  const rs = useReactive<RsType>({
    groupName: "",
    groupIcon: "",
    friendList: [],
    groupList: [],
    selectedList: [],
    memberList: [],
  });
  const { t } = useTranslation();

  useEffect(() => {
    if (modalType === "remove") return;
    rs.friendList = [];
    
    friendList.map((o: any) => {
      o.disabled = false;
      if (modalType === "invite" && groupMembers!.findIndex((m) => m.userID === o.uid) > -1) {
        o.disabled = true;
      }
      o.check = false;
      rs.friendList = [...rs.friendList, o];
    });
  }, [friendList]);

  useEffect(() => {
    if (modalType === "remove") {
      groupMembers?.map((g: any) => {
        if (g.userId !== selfID) {
          g.disabled = false;
          g.check = false;
          rs.memberList = [...rs.memberList, g];
        }
      });
    }
  }, [groupMembers]);

  useEffect(() => {
    if (modalType === "forward") {
      groupList?.map((g: any) => {
        g.disabled = false;
        g.check = false;
        rs.groupList = [...rs.groupList, g];
      });
    }
  }, [groupList]);

  const uploadIcon = async (uploadData: UploadRequestOption) => {
    await getCosAuthorization();
    cosUpload(uploadData)
      .then((res) => {
        rs.groupIcon = res.url;
      })
      .catch((err) => message.error(t("UploadFailed")));
  };

  const modalOperation = () => {
    switch (modalType) {
      case "create":
        createGroup();
        break;
      case "invite":
        inviteToGroup();
        break;
      case "remove":
        kickFromGroup();
        break;
      case "forward":
        forwardMsg();
        break;
      default:
        break;
    }
  };

  const forwardMsg = () => {
    const parseMsg = JSON.parse(options!);
    events.emit(SENDFORWARDMSG, parseMsg.contentType ? options : parseMsg, parseMsg.contentType ?? messageTypes.MERGERMESSAGE, rs.selectedList);
    close();
  };

  const createGroup = () => {
    if (!rs.groupIcon || !rs.groupName || rs.selectedList.length == 0) {
      message.warning(t("CompleteTip"));
      return;
    }

    let memberList: Member[] = [];
    rs.selectedList.map((s) => {
      memberList.push({
        userID: (s as SelectFriendItem).userID,
        roleLevel: 1,
      });
    });
    const options = {
      groupBaseInfo: {
        groupType: 0,
        groupName: rs.groupName,
        introduction: "",
        notification: "",
        faceURL: rs.groupIcon,
        ex:""
      },
      memberList,
    };

    im.createGroup(options)
      .then((res) => {
        message.success(t("GruopCreateSuc"));
        close();
      })
      .catch((err) => {
        message.error(t("GruopCreateFailed"));
        close();
      });
  };

  const inviteToGroup = () => {
    if (rs.selectedList.length === 0) {
      message.warning(t("SelectMemberTip"));
      return;
    }
    let userIDList: string[] = [];
    rs.selectedList.map((s) => userIDList.push((s as SelectFriendItem).userID));
    const options = {
      groupID: groupId!,
      reason: "",
      userIDList,
    };
    im.inviteUserToGroup(options)
      .then((res) => {
        message.success(t("InviteSuc"));
        close();
      })
      .catch((err) => {
        message.error(t("InviteFailed"));
        close();
      });
  };

  const kickFromGroup = () => {
    if (rs.selectedList.length === 0) {
      message.warning(t("KickMemberTip"));
      return;
    }
    let userIDList: string[] = [];
    rs.selectedList.map((s) => userIDList.push((s as SelectMemberItem).userID));
    const options = {
      groupID: groupId!,
      reason: "",
      userIDList,
    };
    im.kickGroupMember(options)
      .then((res) => {
        message.success(t("KickSuc"));
        close();
      })
      .catch((err) => {
        message.error(t("KickFailed"));
        close();
      });
  };

  const selectChange = (selectList: SelectType[]) => {
    rs.selectedList = selectList;
  };

  const switchTitle = () => {
    switch (modalType) {
      case "create":
        return t("CreateGroup");
      case "invite":
        return t("AddMembers");
      case "remove":
        return t("RemoveMembers");
      case "forward":
        return t("ForwardedMessage");
      default:
        return "";
    }
  };

  return (
    <Modal width="60%" className="group_modal" title={switchTitle()} visible={visible} onCancel={close} footer={null} centered>
      <div>
        {modalType === "create" ? (
          <>
            <div className="group_info_item">
              <div className="group_info_label">{t("GroupName")}</div>
              <div style={{ width: "100%" }}>
                <Input placeholder={t("GroupNameTip")} value={rs.groupName} onChange={(e) => (rs.groupName = e.target.value)} />
              </div>
            </div>
            <div className="group_info_item">
              <div className="group_info_label">{t("GroupAvatar")}</div>
              <div>
                <MyAvatar src={rs.groupIcon} size={32} />
                <Upload accept="image/*" action={""} customRequest={(data) => uploadIcon(data)} showUploadList={false}>
                  <span className="group_info_icon">{t("ClickUpload")}</span>
                </Upload>
              </div>
            </div>
            <MultipleSelectBox modalType={modalType} friendList={rs.friendList} onSelectedChange={selectChange} />
          </>
        ) : (
          <MultipleSelectBox modalType={modalType} memberList={rs.memberList} friendList={rs.friendList} groupList={rs.groupList} onSelectedChange={selectChange} />
        )}
        <div className="group_info_footer">
          <Button onClick={close}>{t("Cancel")}</Button>
          <Button onClick={modalOperation} type="primary">
            {t("Confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GroupOpModal;
