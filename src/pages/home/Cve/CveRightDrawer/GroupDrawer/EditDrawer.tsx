import { RightOutlined } from "@ant-design/icons";
import { Button, Input, message, Upload } from "antd";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, shallowEqual } from "react-redux";
import { MyAvatar } from "../../../../../components/MyAvatar";
import { RootState } from "../../../../../store";
import { cosUpload, im } from "../../../../../utils";
import { getCosAuthorization } from "../../../../../utils/cos";
import { GroupItem } from "../../../../../utils/open_im_sdk/types";

type EditDrawerProps = {
  
};

const EditDrawer: FC<EditDrawerProps> = ({  }) => {
  const groupInfo = useSelector((state: RootState) => state.contacts.groupInfo, shallowEqual);
  const [gInfo, setGInfo] = useState<GroupItem>();
  const { t } = useTranslation();

  useEffect(() => {
    if (groupInfo) {
      setGInfo(groupInfo);
    }
  }, [groupInfo]);

  
  const uploadIcon = async (uploadData: UploadRequestOption) => {
    await getCosAuthorization();
    cosUpload(uploadData)
      .then((res) => {
        changeGroupInfo(res.url, "faceURL");
      })
      .catch((err) => message.error(t("UploadFailed")));
  };

  const changeGroupInfo = (val: string, tp: keyof GroupItem) => {
    switch (tp) {
      case "groupName":
        setGInfo({ ...gInfo!, groupName: val });
        break;
      case "faceURL":
        setGInfo({ ...gInfo!, faceURL: val });
        break;
      case "introduction":
        setGInfo({ ...gInfo!, introduction: val });
        break;
      default:
        break;
    }
  };

  const updateGroupInfo = () => {
    const options = {
      groupID: gInfo!.groupID,
      groupInfo: {
        groupName: gInfo!.groupName,
        introduction: gInfo!.introduction,
        notification: gInfo!.notification,
        faceURL: gInfo!.faceURL,
      },
    };
    im.setGroupInfo(options)
      .then((res) => {
        message.success(t("ModifySuc"));
        // setType("set");
      })
      .catch((err) => message.error(t("ModifyFailed")));
  };

  return (
    <div>
      <div className="group_drawer_item">
        <div>{t("GroupAvatar")}</div>
        <div className="group_drawer_item_right">
          <Upload accept="image/*" action={""} customRequest={(data) => uploadIcon(data)} showUploadList={false}>
            <MyAvatar size={36} shape="square" src={groupInfo?.faceURL} />
          </Upload>
          <RightOutlined />
        </div>
      </div>
      <div className="group_drawer_row">
        <div className="group_drawer_row_title">
          <div>{t("GroupName")}</div>
        </div>
        <div style={{ marginBottom: 0 }} className="group_drawer_row_input">
          <Input key="group_name" value={groupInfo?.groupName} onChange={(e) => changeGroupInfo(e.target.value, "groupName")} placeholder="请输入群名称" />
        </div>
      </div>
      <div style={{ border: "none" }} className="group_drawer_row">
        <div className="group_drawer_row_title">
          <div>{t("GroupDesc")}</div>
        </div>
        <div style={{ marginBottom: 0 }} className="group_drawer_row_input">
          <Input.TextArea
            key="group_introduction"
            value={groupInfo?.introduction}
            onChange={(e) => changeGroupInfo(e.target.value, "introduction")}
            showCount
            autoSize={{ minRows: 4, maxRows: 6 }}
            placeholder={t("GroupDescTip")}
          />
        </div>
      </div>
      <Button onClick={updateGroupInfo} type="primary" className="single_drawer_btn">
        {t("Save")}
      </Button>
    </div>
  );
};

export default EditDrawer;
