import { useUpdateEffect } from "ahooks";
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import ContactList from "../../../components/ContactList";
import { APPLICATIONTYPEUPDATE, CLEARSEARCHINPUT, TOASSIGNCVE } from "../../../constants/events";
import { SessionType } from "../../../constants/messageContentType";
import { RootState } from "../../../store";
import { setGroupMemberLoading } from "../../../store/actions/contacts";
import { events } from "../../../utils";
import { FriendApplicationItem, FriendItem, GroupApplicationItem, GroupItem } from "../../../utils/open_im_sdk/types";
import { MenuItem } from "./ContactMenuList";
import GroupList from "./GroupList";
import NewNotice from "./NewNotice";

type ContactContentProps = {
  menu: MenuItem;
};

export type ContactContentHandler = {
  searchCb: (value: string, idx: number) => void;
};

const ContactContent: ForwardRefRenderFunction<ContactContentHandler, ContactContentProps> = ({ menu }, ref) => {
  const friendList = useSelector((state: RootState) => state.contacts.friendList, shallowEqual);
  const groupList = useSelector((state: RootState) => state.contacts.groupList, shallowEqual);
  const recvFriendApplicationList = useSelector((state: RootState) => state.contacts.recvFriendApplicationList, shallowEqual);
  const sentFriendApplicationList = useSelector((state: RootState) => state.contacts.sentFriendApplicationList, shallowEqual);
  const recvGroupApplicationList = useSelector((state: RootState) => state.contacts.recvGroupApplicationList, shallowEqual);
  const sentGroupApplicationList = useSelector((state: RootState) => state.contacts.sentGroupApplicationList, shallowEqual);

  const [renderType, setRenderType] = useState<"recv" | "sent">("recv");
  const [contacts, setContacts] = useState<FriendItem[] | GroupItem[] | FriendApplicationItem[] | GroupApplicationItem[]>([]);
  const [searchFlag, setSearchFlag] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    events.on(APPLICATIONTYPEUPDATE, applicationUpdateHandler);
    return () => {
      events.off(APPLICATIONTYPEUPDATE, applicationUpdateHandler);
    };
  }, []);

  useUpdateEffect(() => {
    if (menu.idx === 1 || menu.idx === 2) {
      setRenderType("recv");
    }
    if (searchFlag) {
      setSearchFlag(false);
      events.emit(CLEARSEARCHINPUT);
    }
  }, [menu]);

  const applicationUpdateHandler = (type: "recv" | "sent") => {
    setRenderType(type);
  };

  const clickListItem = (item: FriendItem | GroupItem, type: SessionType) => {
    if (type === SessionType.GROUPCVE) {
      dispatch(setGroupMemberLoading(true));
    }
    navigate("/");
    setTimeout(() => {
      events.emit(TOASSIGNCVE, type === SessionType.SINGLECVE ? (item as FriendItem).userID : (item as GroupItem).groupID, type);
    }, 0);
  };

  const searchTemplate = (value: string, fields: string[], origin: any[]) => {
    // @ts-ignore
    const filterArr = origin.filter((o) => fields.find((field) => o[field].includes(value)));
    setContacts(filterArr);
  };

  const searchCb = (value: string, idx: number) => {
    if (value === "") {
      setSearchFlag(false);
      return;
    }
    setSearchFlag(true);
    switch (idx) {
      case 0:
      case 3:
        const friendFields = ["nickname", "remark", "userID"];
        searchTemplate(value, friendFields, friendList);
        break;
      case 1:
        const recvFriendApplicationFields = ["fromNickname", "fromUserID"];
        const sentFriendApplicationFields = ["toUserID", "toNickname"];
        searchTemplate(
          value,
          renderType === "recv" ? recvFriendApplicationFields : sentFriendApplicationFields,
          renderType === "recv" ? recvFriendApplicationList : sentFriendApplicationList
        );
        break;
      case 2:
        const recvGroupApplicationFields = ["groupName", "groupID", "nickname", "userID"];
        const sentGroupApplicationFields = ["groupName", "groupID"];
        searchTemplate(
          value,
          renderType === "recv" ? recvGroupApplicationFields : sentGroupApplicationFields,
          renderType === "recv" ? recvGroupApplicationList : sentGroupApplicationList
        );
        break;
      case 4:
        const groupFields = ["groupName", "groupID"];
        searchTemplate(value, groupFields, groupList);
        break;
    }
  };

  useImperativeHandle(ref, () => {
    return {
      searchCb,
    };
  });

  const switchContent = () => {
    switch (menu.idx) {
      case 1:
      case 2:
        let tmpList;
        if (!searchFlag) {
          if (menu.idx === 1 && renderType === "recv") {
            tmpList = recvFriendApplicationList;
          } else if (menu.idx === 1 && renderType === "sent") {
            tmpList = sentFriendApplicationList;
          } else if (menu.idx === 2 && renderType === "recv") {
            tmpList = recvGroupApplicationList;
          } else if (menu.idx === 2 && renderType === "sent") {
            tmpList = sentGroupApplicationList;
          }
        }
        return <NewNotice type={menu.idx} renderType={renderType} renderList={searchFlag ? contacts : tmpList} />;
      case 0:
      case 3:
        return <ContactList clickItem={clickListItem} contactList={searchFlag ? (contacts as FriendItem[]) : friendList} />;
      case 4:
        return <GroupList groupList={searchFlag ? (contacts as GroupItem[]) : groupList} clickItem={clickListItem} />;
      default:
        return null;
    }
  };
  return switchContent();
};

export default forwardRef(ContactContent);
