import { UserAddOutlined, MessageOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Layout, Modal, Input, Button, message } from "antd";
import { cloneElement, FC, forwardRef, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchBar, { SearchBarHandle } from "../../../components/SearchBar";
import { CLEARSEARCHINPUT, FORWARDANDMERMSG, OPENGROUPMODAL, OPENSINGLEMODAL, TOASSIGNCVE } from "../../../constants/events";
import { events, im } from "../../../utils";
import { FriendItem, GroupItem, GroupMemberItem, PublicUserItem } from "../../../utils/open_im_sdk/types";
import GroupCard from "./GroupCard";
import GroupOpModal, { ModalType } from "./GroupOpModal";
import UserCard from "./UserCard";

const { Sider } = Layout;

type AddConModalProps = {
  isAddConsVisible: boolean;
  loading: boolean;
  type: "friend" | "group";
  searchCons: () => void;
  cancleSearch: () => void;
  getNo: (no: string) => void;
  closeLoading: () => void;
};

const AddConModal: FC<AddConModalProps> = ({ isAddConsVisible, loading, type, searchCons, cancleSearch, getNo, closeLoading }) => {
  const { t } = useTranslation();
  useEffect(() => {
    return () => {
      if (loading) closeLoading();
    };
  }, [loading]);
  return (
    <Modal
      key="AddConModal"
      className="add_cons_modal"
      title={type === "friend" ? t("AddFriend") : t("JoinGroup")}
      visible={isAddConsVisible}
      centered
      destroyOnClose
      width={360}
      onCancel={cancleSearch}
      footer={[
        <Button key="comfirmBtn" loading={loading} onClick={searchCons} className="add_cons_modal_btn" type="primary">
          {t("Confirm")}
        </Button>,
        <Button key="cancelBtn" onClick={cancleSearch} className="add_cons_modal_btn" type="default">
          {t("Cancel")}
        </Button>,
      ]}
    >
      <Input allowClear placeholder={`${t("PleaseInput")}${type === "friend" ? t("User") : t("Group")}ID`} onChange={(v) => getNo(v.target.value)} />
    </Modal>
  );
};

type HomeSiderProps = {
  searchCb: (value: string) => void;
};

type GroupInfoType = {
  members: GroupMemberItem[];
  gid: string;
};

const HomeSider: FC<HomeSiderProps> = ({ children, searchCb }) => {
  const [isAddConsVisible, setIsAddConsVisible] = useState(false);
  const [userCardVisible, setUserCardVisible] = useState(false);
  const [groupCardVisible, setGroupCardVisible] = useState(false);
  const [groupOpModalVisible, setGroupOpModalVisible] = useState(false);
  const [forwardMsg, setForwardMsg] = useState("");
  const [addConNo, setAddConNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [serchRes, setSerchRes] = useState({} as any);
  const [addType, setAddType] = useState<"friend" | "group">("friend");
  const [modalType, setModalType] = useState<ModalType>("create");
  const [groupInfo, setGroupInfo] = useState<GroupInfoType>();
  const [singleType, setSingleType] = useState<string | undefined>();
  const searchRef = useRef<SearchBarHandle>(null);
  const { t } = useTranslation();

  useEffect(() => {
    events.on(TOASSIGNCVE, assignHandler);
    events.on(OPENSINGLEMODAL, openSingleModalHandler);
    events.on(OPENGROUPMODAL, openGroupModalHandler);
    events.on(FORWARDANDMERMSG, forwardMsgHandler);
    events.on(CLEARSEARCHINPUT, clearSearchHandler);
    return () => {
      events.off(TOASSIGNCVE, assignHandler);
      events.off(OPENSINGLEMODAL, openSingleModalHandler);
      events.off(OPENGROUPMODAL, openGroupModalHandler);
      events.off(FORWARDANDMERMSG, forwardMsgHandler);
      events.off(CLEARSEARCHINPUT, clearSearchHandler);
    };
  }, []);

  const forwardMsgHandler = (type: string, options: string) => {
    setModal("forward");
    setForwardMsg(options);
    setGroupOpModalVisible(true);
  };

  const assignHandler = () => {
    setUserCardVisible(false);
    setGroupCardVisible(false);
    setIsAddConsVisible(false);
  };

  const openSingleModalHandler = (info: FriendItem | PublicUserItem, type?: string) => {
    setSerchRes(info);
    setSingleType(type);
    setUserCardVisible(true);
  };

  const openGroupModalHandler = (type: ModalType, members: GroupMemberItem[], gid: string) => {
    setGroupInfo({ members, gid });
    setModal(type);
  };

  const clearSearchHandler = () => {
    searchRef.current?.clear();
  };

  const clickMenuItem = (idx: number) => {
    switch (idx) {
      case 0:
        setAddType("friend");
        setIsAddConsVisible(true);
        break;
      case 1:
        setAddType("group");
        setIsAddConsVisible(true);
        break;
      case 2:
        setModal("create");
        break;
      default:
        break;
    }
  };

  const getNo = (no: string) => {
    setAddConNo(no);
  };

  const menus = [
    {
      title: t("AddFriend"),
      icon: <UserAddOutlined style={{ fontSize: "16px", color: "#fff" }} />,
      method: clickMenuItem,
    },
    {
      title: t("JoinGroup"),
      icon: <UsergroupAddOutlined style={{ fontSize: "16px", color: "#fff" }} />,
      method: clickMenuItem,
    },
    {
      title: t("CreateGroup"),
      icon: <MessageOutlined style={{ fontSize: "16px", color: "#fff" }} />,
      method: clickMenuItem,
    },
  ];

  const searchCons = () => {
    // setUserCardVisible(true)
    if (!addConNo) return;
    setLoading(true);
    if (addType === "friend") {
      im.getUsersInfo([addConNo])
        .then((res) => {
          const tmpArr = JSON.parse(res.data);
          if (tmpArr.length > 0) {
            setSerchRes(tmpArr[0].friendInfo ? tmpArr[0].friendInfo : tmpArr[0].publicInfo);
            setUserCardVisible(true);
          } else {
            message.info(t("UserSearchEmpty"));
          }
          setLoading(false);
        })
        .catch((err) => {
          message.error(t("AccessFailed"));
          setLoading(false);
        });
    } else {
      im.getGroupsInfo([addConNo])
        .then((res) => {
          const tmpArr = JSON.parse(res.data);
          if (tmpArr.length > 0) {
            setSerchRes(tmpArr[0]);
            setGroupCardVisible(true);
          } else {
            message.info(t("GroupSearchEmpty"));
          }
          setLoading(false);
        })
        .catch((err) => {
          message.error(t("AccessFailed"));
          setLoading(false);
        });
    }
  };

  const cancleSearch = () => {
    setAddConNo("");
    setIsAddConsVisible(false);
  };

  const closeDragCard = () => {
    setUserCardVisible(false);
    setGroupCardVisible(false);
  };

  const closeOpModal = () => {
    setGroupOpModalVisible(false);
  };

  const setModal = (type: ModalType) => {
    setModalType(type);
    setGroupOpModalVisible(true);
  };

  const closeLoading = () => {
    setLoading(false);
  };

  return (
    <Sider width="350" theme="light" className="home_sider" style={{ borderRight: "1px solid #DEDFE0" }}>
      <div style={{ padding: 0 }}>
        <SearchBar ref={searchRef} searchCb={searchCb} menus={menus} />
        {
          //@ts-ignore
          cloneElement(children, { marginTop: window.electron ? 86 : 58 })
        }
      </div>
      {isAddConsVisible && (
        <AddConModal
          closeLoading={closeLoading}
          isAddConsVisible={isAddConsVisible}
          loading={loading}
          searchCons={searchCons}
          cancleSearch={cancleSearch}
          getNo={getNo}
          type={addType}
        />
      )}
      {userCardVisible && <UserCard close={closeDragCard} type={singleType} info={serchRes} draggableCardVisible={userCardVisible} />}
      {groupCardVisible && <GroupCard close={closeDragCard} info={serchRes as GroupItem} draggableCardVisible={groupCardVisible} />}
      {groupOpModalVisible && (
        <GroupOpModal options={forwardMsg} groupId={groupInfo?.gid} groupMembers={groupInfo?.members} modalType={modalType} visible={groupOpModalVisible} close={closeOpModal} />
      )}
    </Sider>
  );
};

export default HomeSider;
