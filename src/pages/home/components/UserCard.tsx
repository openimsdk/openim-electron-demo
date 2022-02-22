import { LeftOutlined } from "@ant-design/icons";
import { Descriptions, Button, Input, Modal, Typography, Form, message, Upload } from "antd";
import { FC, useState, useRef, useEffect } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { cosUpload, events, im } from "../../../utils";
import self_card from "@/assets/images/self_card.png";
import del_card from "@/assets/images/del_card.png";
import { MyAvatar } from "../../../components/MyAvatar";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { getSelfInfo } from "../../../store/actions/user";
import { getFriendList } from "../../../store/actions/contacts";
import { TOASSIGNCVE, UPDATEFRIENDCARD } from "../../../constants/events";
import { SessionType } from "../../../constants/messageContentType";
import { useTranslation } from "react-i18next";
import { PublicUserItem, FriendItem, PartialUserItem, FullUserItem } from "../../../utils/open_im_sdk/types";
import { getCosAuthorization } from "../../../utils/cos";

const { Paragraph } = Typography;

type UserCardProps = {
  draggableCardVisible: boolean;
  info: PublicUserItem | FriendItem | FullUserItem;
  close: () => void;
  type?: string;
};

const UserCard: FC<UserCardProps> = ({ draggableCardVisible, info, close, type }) => {
  const [draggDisable, setDraggDisable] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  // const [drft, setDrft] = useState("");
  const [step, setStep] = useState<"info" | "send">("info");
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draRef = useRef<any>(null);
  const selectValue = (state: RootState) => state.contacts.friendList;
  const friendList = useSelector(selectValue, shallowEqual);
  const selfID = useSelector((state: RootState) => state.user.selfInfo.userID, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  let selfInfo: PartialUserItem = {
    userID: selfID,
  };
  let drft = "";

  useEffect(() => {
    if ((info as FriendItem).remark !== undefined) {
      setIsFriend(true);
      setStep("info");
      return;
    }

    if (!type) {
      const idx = friendList.findIndex((f) => f.userID == info.userID);

      if (idx > -1) {
        setIsFriend(true);
        setStep("info");
      } else {
        setIsFriend(false);
        drft = "";
      }
    }
  }, [friendList, draggableCardVisible]);

  const onStart = (event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draRef!.current!.getBoundingClientRect();
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y),
    });
  };

  const sendApplication = ({ reqMsg }: { reqMsg: string }) => {
    const param = {
      toUserID: info.userID!,
      reqMsg,
    };
    im.addFriend(param)
      .then((res) => {
        console.log(res);
        message.success(t("SendFriendSuc"));
        close();
      })
      .catch((err) => {
        message.error(t("SendFriendFailed"));
      });
  };

  const clickBtn = () => {
    if (isFriend) {
      events.emit(TOASSIGNCVE, info.userID, SessionType.SINGLECVE);
      close();
    } else {
      setStep("send");
    }
  };

  const updateSelfInfo = () => {
    im.setSelfInfo(selfInfo)
      .then((res) => {
        dispatch(getSelfInfo());
        message.success(t("ModifySuc"));
      })
      .catch((err) => message.error(t("ModifyFailed")));
  };

  const updateComment = () => {
    im.setFriendRemark({ toUserID: info.userID!, remark: drft })
      .then((res) => {
        dispatch(getFriendList());
        (info as FriendItem).remark = drft;
        events.emit(UPDATEFRIENDCARD, info);
        message.success(t("ModifySuc"));
      })
      .catch((err) => message.error(t("ModifyFailed")));
  };

  const uploadIcon = async (uploadData: UploadRequestOption) => {
    await getCosAuthorization();
    cosUpload(uploadData)
      .then((res) => {
        selfInfo = { userID: selfID };
        selfInfo.faceURL = res.url;
        updateSelfInfo();
      })
      .catch((err) => message.error(t("UploadFailed")));
  };

  const goBack = () => {
    setStep("info");
    form.resetFields();
  };

  const myClose = () => {
    close();
    drft = "";
    setStep("info");
    form.resetFields();
  };

  const genderEnd = () => {
    console.log(drft);

    if (drft === t("Man")) {
      selfInfo.gender = 1;
      updateSelfInfo();
    } else if (drft === t("Woman")) {
      selfInfo.gender = 2;
      updateSelfInfo();
    } else {
      message.warning(t("FormatTip"));
    }
  };

  const infoEditConfig = {
    onEnd: updateComment,
    onChange: (s: string) => (drft = s),
    onCancel: () => (drft = ""),
    autoSize: { maxRows: 2 },
    maxLength: 15,
  };

  const delContact = () => {
    im.deleteFriend(info.userID!)
      .then((res) => {
        message.success(t("UnfriendingSuc"));
        close();
      })
      .catch((err) => message.error(t("UnfriendingFailed")));
  };

  const InfoTitle = () => (
    <>
      <div className="left_info">
        <div className="left_info_title">{info.nickname}</div>
        <div className="left_info_icon">
          <img width={18} src={self_card} alt="" />
          {isFriend && <img onClick={delContact} style={{ marginLeft: "8px" }} width={18} src={del_card} />}
        </div>
      </div>
      <Upload accept="image/*" openFileDialogOnClick={type ? true : false} action="" customRequest={(data) => uploadIcon(data)} showUploadList={false}>
        <MyAvatar src={info.faceURL} size={42} />
      </Upload>
    </>
  );

  const SendTitle = () => (
    <>
      <div className="send_msg_title">
        <LeftOutlined className="cancel_drag" onClick={goBack} style={{ fontSize: "12px", marginRight: "12px" }} />
        <div className="send_msg_title_text">{t("FriendVerification")}</div>
      </div>
    </>
  );

  const SelfBody = () => (
    <>
      <Descriptions column={1} title={t("SelfInfo")}>
        <Descriptions.Item label={t("Nickname")}>
          <Paragraph
            editable={{
              maxLength: 15,
              onChange: (v) => (drft = v),
              onEnd: () => {
                selfInfo = { userID: selfID };
                selfInfo.nickname = drft;
                updateSelfInfo();
              },
              onCancel: () => (drft = ""),
            }}
          >
            {info.nickname}
          </Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label={t("Sex")}>
          <Paragraph
            editable={{
              maxLength: 1,
              onChange: (v) => (drft = v),
              onEnd: genderEnd,
              onCancel: () => (drft = ""),
            }}
          >
            {info.gender === 1 ? t("Man") : t("Woman")}
          </Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label="ID">{info.userID!}</Descriptions.Item>
        <Descriptions.Item label={t("PhoneNumber")}>
          <Paragraph
            editable={{
              maxLength: 11,
              onChange: (v) => (drft = v),
              onEnd: () => {
                selfInfo = { userID: selfID };
                selfInfo.phoneNumber = drft;
                updateSelfInfo();
              },
              onCancel: () => (drft = ""),
            }}
          >
            {(info as FullUserItem).phoneNumber}
          </Paragraph>
        </Descriptions.Item>
      </Descriptions>
    </>
  );

  const InfoBody = () => (
    <>
      <Descriptions column={1} title={t("UserInfo")}>
        <Descriptions.Item label={t("Nickname")}>{info.nickname}</Descriptions.Item>
        {isFriend && (
          <Descriptions.Item label={t("Note")}>
            <Paragraph editable={infoEditConfig}>{(info as FriendItem).remark}</Paragraph>
          </Descriptions.Item>
        )}
        <Descriptions.Item label={t("Sex")}>{info.gender === 1 ? t("Man") : t("Woman")}</Descriptions.Item>
        {/* <Descriptions.Item label={t("Brithday")}>{info.}</Descriptions.Item> */}
        <Descriptions.Item label="ID">{info.userID!}</Descriptions.Item>
        {/* <Descriptions.Item label="手机号">{info.mobile}</Descriptions.Item> */}
      </Descriptions>
      <Button onClick={clickBtn} className="add_con_btn" type="primary">
        {isFriend ? t("SendMessage") : t("AddFriend")}
      </Button>
    </>
  );

  const SendBody = () => (
    <>
      <div className="send_card_info">
        <div className="send_card_info_row1">
          <div>{info.nickname}</div>
          <MyAvatar src={info.faceURL} size={42} />
        </div>
        <Form form={form} name="basic" onFinish={sendApplication} autoComplete="off">
          <Form.Item name="reqMsg">
            <Input placeholder={t("VerficationTip")} />
          </Form.Item>
        </Form>
      </div>
      <Button onClick={() => form.submit()} className="add_con_btn" type="primary">
        {t("Send")}
      </Button>
    </>
  );

  const switchBody = () => {
    if (type) return <SelfBody />;
    switch (step) {
      case "info":
        return <InfoBody />;
      case "send":
        return <SendBody />;
      default:
        return null;
    }
  };

  const ignoreClasses = `.cancel_drag, .cancel_input, .ant-upload,.left_info_icon,.ant-modal-body,.ant-upload`;

  return (
    <Modal
      // key="UserCard"
      className={step !== "send" ? "draggable_card" : "draggable_card_next"}
      closable={false}
      footer={null}
      mask={false}
      width={280}
      destroyOnClose={true}
      centered
      onCancel={myClose}
      title={
        <div
          className="draggable_card_title"
          // onMouseOver={() => {
          //   if (draggDisable) {
          //     setDraggDisable(false);
          //   }
          // }}
          // onMouseOut={() => {
          //   setDraggDisable(true);
          // }}
        >
          {step === "info" ? <InfoTitle /> : <SendTitle />}
        </div>
      }
      visible={draggableCardVisible}
      modalRender={(modal) => (
        <Draggable
          allowAnyClick={true}
          disabled={draggDisable}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
          cancel={ignoreClasses}
          enableUserSelectHack={false}
        >
          <div ref={draRef}>{modal}</div>
        </Draggable>
      )}
    >
      {switchBody()}
    </Modal>
  );
};

export default UserCard;
