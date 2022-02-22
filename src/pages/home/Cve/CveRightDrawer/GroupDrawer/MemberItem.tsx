import { DeleteOutlined } from "@ant-design/icons";
import { Modal, message, Tooltip, Skeleton } from "antd";
import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MemberMapType } from "../../../../../@types/open_im";
import LayLoad from "../../../../../components/LayLoad";
import { MyAvatar } from "../../../../../components/MyAvatar";
import { im } from "../../../../../utils";
import { GroupMemberItem } from "../../../../../utils/open_im_sdk/types";
import { GroupRole } from "../CveRightDrawer";

type MemberItemProps = {
  item: GroupMemberItem;
  member2Status: MemberMapType;
  role: GroupRole;
  gid: string;
  selfID: string;
  idx: number;
};

const MemberItem: FC<MemberItemProps> = ({ idx, item, member2Status, role, gid, selfID }) => {
  const memberItemRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  
  const parseStatus = (userID: string) => {
    let str = t("Offline");
    const item = member2Status[userID];
    if (item) {
      if (item.status === "online") {
        str = "";
        item.detailPlatformStatus?.map((pla) => {
          if (pla.status === "online") {
            str += `${pla.platform}/`;
          }
        });
        str = str.slice(0, -1)+t("Online");
      }
    }
    return `[${str}]`;
  };

  const warning = (item: GroupMemberItem) => {
    Modal.confirm({
      title: t("RemoveMembers"),
      content: t("RemoveTip1")+item.nickname+" "+ t("RemoveTip2"),
      cancelText: t("Cancel"),
      okText: t("Remove"),
      okButtonProps: {
        danger: true,
        type: "primary",
      },
      closable: false,
      className: "warning_modal",
      onOk: () => removeMember(item.userID),
    });
  };

  const removeMember = (id: string) => {
    const options = {
      groupID: gid,
      reason: "kick",
      userIDList: [id],
    };
    im.kickGroupMember(options)
      .then((res) => {
        message.success(t("KickSuc"));
      })
      .catch((err) => message.error(t("KickFailed")));
  };

  const RemoveIcon = ({ item }: { item: GroupMemberItem }) => (
    <Tooltip placement="left" title={t("RemoveMembers")}>
      <DeleteOutlined onClick={() => warning(item)} />
    </Tooltip>
  );

  const getPermission = (item: GroupMemberItem) => {
    if (role === GroupRole.OWNER) {
      if (item.roleLevel !== GroupRole.OWNER) {
        return <RemoveIcon item={item} />;
      }
    } else if (role === GroupRole.ADMIN) {
      if (item.roleLevel !== GroupRole.OWNER && item.roleLevel !== GroupRole.ADMIN) {
        return <RemoveIcon item={item} />;
      }
    }
    return null;
  };

  const switchTip = (role: number) => {
    switch (role) {
      case 1:
        return null;
      case 2:
        return <div className="owner_tip">{t("GroupOwner")}</div>;
      case 3:
        return <div className="admin_tip">{t("GroupAdministrators")}</div>;
      default:
        break;
    }
  };
  return (
    <div ref={memberItemRef} className="group_members_list_item">
      <div style={{ display: "flex" }}>
          <LayLoad forceLoad={idx<20} targetRef={memberItemRef} skeletonCmp={<Skeleton.Avatar active={true} size={36} shape="square" />}>
            <MyAvatar size={36} src={item.faceURL} />
          </LayLoad>
        <div className="member_info">
          <div className="title">
            <div>{item.nickname}</div>
            {switchTip(item.roleLevel)}
          </div>
          <div className="member_status">{parseStatus(item.userID)}</div>
        </div>
      </div>
      {getPermission(item)}
    </div>
  );
};

export default MemberItem;
