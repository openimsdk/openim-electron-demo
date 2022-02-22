import { RightOutlined } from "@ant-design/icons";
import { Switch, Button, message } from "antd";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MyAvatar } from "../../../../components/MyAvatar";
import { OPENSINGLEMODAL, RESETCVE } from "../../../../constants/events";
import { RootState } from "../../../../store";
import { setCurCve, setCveList } from "../../../../store/actions/cve";
import { events, im } from "../../../../utils";
import { ConversationItem, OptType } from "../../../../utils/open_im_sdk/types";

type SingleDrawerProps = {
  curCve: ConversationItem;
  updatePin: () => void;
  updateOpt: () => void;
};

enum ShipType {
  Nomal = 0,
  Friend = 1,
  Black = 2,
}

const SingleDrawer: FC<SingleDrawerProps> = ({ curCve, updateOpt, updatePin }) => {
  const blackList = useSelector((state: RootState) => state.contacts.blackList, shallowEqual);
  const friendList = useSelector((state: RootState) => state.contacts.friendList, shallowEqual);
  const cveList = useSelector((state: RootState) => state.cve.cves, shallowEqual);
  const [ship, setShip] = useState<ShipType>();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    let flag = 0;
    if (friendList.find((item) => item.userID === curCve?.userID)) {
      flag = 1;
    } else if (blackList.find((item) => item.userID === curCve?.userID)) {
      flag = 2;
    }
    setShip(flag);
  }, [blackList, friendList]);

  const blackListChnage = (e: boolean) => {
    if (e) {
      im.addBlack(curCve?.userID!)
        .then((res) => message.success(t("AddBlackSuc")))
        .catch((err) => message.error(t("AddBlackFailed")));
    } else {
      im.removeBlack(curCve?.userID!).catch((err) => message.error(t("RemoveBlackFailed")));
    }
  };

  const delFriend = () => {
    im.deleteFriend(curCve.userID)
      .then((res) => {
        events.emit(RESETCVE);
        message.success(t("UnfriendingSuc"));
        delCve();
      })
      .catch((err) => message.error(t("UnfriendingFailed")));
  };

  const delCve = () => {
    im.deleteConversation(curCve.conversationID)
      .then((res) => {
        const tarray = [...cveList];
        const farray = tarray.filter((c) => c.conversationID !== curCve.conversationID);
        dispatch(setCveList(farray));
        dispatch(setCurCve(null));
      })
      .catch((err) => message.error(t("AccessFailed")));
  };

  const getFriendOrPublicInfo = async (id: string) => {
    const { data } = await im.getDesignatedFriendsInfo([id]);
    if (JSON.parse(data).friendInfo) {
      return JSON.parse(data).length > 0 ? JSON.parse(data)[0].friendInfo : false;
    } else {
      const { data: result } = await im.getUsersInfo([id]);
      return JSON.parse(result).length > 0 ? JSON.parse(result)[0].publicInfo : false;
    }
  };

  const openCard = async () => {
    const info = await getFriendOrPublicInfo(curCve.userID);
    if (info) {
      events.emit(OPENSINGLEMODAL, info);
    } else {
      message.error(t("GetUserFailed"));
    }
  };

  return (
    <div className="single_drawer">
      <div onClick={openCard} className="single_drawer_item">
        <div className="single_drawer_item_left">
          <MyAvatar size={36} shape="square" src={curCve.faceURL} />
          <div style={{ fontWeight: 500 }} className="single_drawer_item_title">
            {curCve.showName}
          </div>
        </div>
        <RightOutlined />
      </div>
      {/* <div className="single_drawer_item">
        <div className="single_drawer_item_left">
          <TeamOutlined />
          <div className="single_drawer_item_title">创建群组</div>
        </div>
        <RightOutlined />
      </div> */}
      <div className="single_drawer_item">
        <div>{t("Pin")}</div>
        <Switch checked={curCve.isPinned} size="small" onChange={updatePin} />
      </div>
      <div className="single_drawer_item">
        <div>{t("AddBlack")}</div>
        <Switch size="small" checked={ship === ShipType.Black} onChange={(e) => blackListChnage(e)} />
      </div>
      <div className="single_drawer_item">
        <div>{t("NotDisturb")}</div>
        <Switch checked={curCve.recvMsgOpt !== OptType.Nomal} size="small" onChange={updateOpt} />
      </div>
      {ship === ShipType.Friend && (
        <Button onClick={delFriend} danger className="single_drawer_btn">
          {t("RemoveFriend")}
        </Button>
      )}
    </div>
  );
};

export default SingleDrawer;
