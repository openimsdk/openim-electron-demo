import { EllipsisOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { MyAvatar } from "../../../../../components/MyAvatar";
import { RootState } from "../../../../../store";
import { im } from "../../../../../utils";
import { PublicUserItem } from "../../../../../utils/open_im_sdk/types";

export const GroupNotice = () => {
  const groupInfo = useSelector((state: RootState) => state.contacts.groupInfo, shallowEqual);
  const [ownerInfo, setOwnerInfo] = useState<PublicUserItem>();

  useEffect(() => {
    if (groupInfo) {
      im.getUsersInfo([groupInfo.ownerUserID]).then((res) => {
        setOwnerInfo(JSON.parse(res.data).length > 0 ? JSON.parse(res.data)[0].publicInfo : {});
      });
    }
  }, [groupInfo]);

  return (
    <div className="group_notice">
      <div className="group_notice_title">
        <div className="left">
          <MyAvatar src={ownerInfo?.faceURL} size={36} />
          <div className="left_info">
            <div>{ownerInfo?.nickname}</div>
            <div>15:20</div>
          </div>
        </div>
        <EllipsisOutlined />
      </div>
      <div>{groupInfo?.notification}</div>
    </div>
  );
};
