import {
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Col, Input, message, Modal, Row } from "antd";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { MyAvatar } from "../../../../../components/MyAvatar";
import { im } from "../../../../../utils";
import { GroupMemberItem } from "../../../../../utils/open_im_sdk/types";

type GroupManageProps = {
  adminList: GroupMemberItem[];
  groupMembers:GroupMemberItem[];
  gid:string;
};

const GroupManage: FC<GroupManageProps> = ({ adminList,groupMembers,gid }) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const transfer = (newOwnerUserID:string) => {
      im.transferGroupOwner({groupID:gid,newOwnerUserID}).then(res=>{
          message.success(t("TransferSuc"))
          setVisible(false)
      }).catch(err=>message.error(t("TransferFailed")))
  }

  const warning = (item:GroupMemberItem) => {
    Modal.confirm({
      title:t("TransferGroup"),
      content: t("TransferTip")+" "+item.nickname,
      closable:false,
      className:"warning_modal",
      onOk: ()=>transfer(item.userID)
    })
  }

  return (
    <div className="group_drawer">
      <div className="group_drawer_row">
        <div
          //   onClick={() => changeType("member_list")}
          className="group_drawer_row_title"
        >
          <div>{t("GroupAdministrators")}</div>
          <div>
            <span className="num_tip">0/10</span>
            <RightOutlined />
          </div>
        </div>
        <div className="group_drawer_row_icon">
          {adminList!.length > 0
            ? adminList!.map((gm, idx) => {
                if (idx < 7) {
                  return (
                    <MyAvatar
                      key={gm.userID}
                      shape="square"
                      size={32.8}
                      src={gm.faceURL}
                      icon={<UserOutlined />}
                    />
                  );
                }
              })
            : null}
          <PlusOutlined onClick={() => {}} />
          <MinusOutlined onClick={() => {}} />
        </div>
      </div>
      <div
        onClick={() => setVisible(true)}
        style={{ border: "none" }}
        className="group_drawer_item"
      >
        <div>{t("TransferGroup")}</div>
        <RightOutlined />
      </div>
      <Modal
        title={t("TransferGroup")}
        className="transfer_modal"
        visible={visible}
        onOk={() => {}}
        onCancel={() => setVisible(false)}
      >
        <Input placeholder={t("Search")} prefix={<SearchOutlined />} />
        <Row className="gutter_row" gutter={[16, 0]}>
            {
                groupMembers.map(m=>(
                    <Col key={m.userID} onClick={()=>warning(m)} span={6}>
                        <div className="member_item">
                            <MyAvatar src={m.faceURL} size={36}/>
                            <span className="member_nick">{m.nickname}</span>
                        </div>
                    </Col>
                ))
            }
          
        </Row>
      </Modal>
    </div>
  );
};

export default GroupManage;
