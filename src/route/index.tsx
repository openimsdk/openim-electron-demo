import { BrowserRouter, HashRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Mylayout from "../layout/MyLayout";
import Login from "../pages/login/Login";
import Home from "../pages/home/Cve/cve";
import Contacts from "../pages/home/Contact/contacts";
import Profile from "../pages/home/Profile/Profile";
import { ReactNode, useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { RootState } from "../store";
import { events, im } from "../utils";
import { getIMUrl } from "../config";
import { message, Modal, Spin } from "antd";
import { getCveList, setCurCve, setCveList } from "../store/actions/cve";
import {
  getBlackList,
  getRecvFriendApplicationList,
  getFriendList,
  getRecvGroupApplicationList,
  getGroupList,
  getUnReadCount,
  setUnReadCount,
  getSentFriendApplicationList,
  getSentGroupApplicationList,
  setSentGroupApplicationList,
  setSentFriendApplicationList,
  setRecvFriendApplicationList,
  setRecvGroupApplicationList,
  setFriendList,
  setBlackList,
  setGroupList,
  setGroupMemberList,
  setGroupInfo,
  getGroupMemberList,
} from "../store/actions/contacts";
import { getSelfInfo, getAdminToken } from "../store/actions/user";
import { CbEvents } from "../utils/open_im_sdk";
import { ConversationItem, FriendApplicationItem, GroupApplicationItem, WsResponse } from "../utils/open_im_sdk/types";
import { OPENSINGLEMODAL } from "../constants/events";
import { cveSort } from "../utils";

type GruopHandlerType = "added" | "deleted" | "info" | "memberAdded" | "memberDeleted";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const curuid = localStorage.getItem("curimuid")!;
  const userID = localStorage.getItem("lastimuid")!;
  const token = localStorage.getItem(`improfile`)!;
  const [golbalLoading, setGolbalLoading] = useState(false);
  const cves = useSelector((state: RootState) => state.cve.cves, shallowEqual);
  const selfInfo = useSelector((state: RootState) => state.user.selfInfo, shallowEqual);
  const sentGroupApplicationList = useSelector((state: RootState) => state.contacts.sentGroupApplicationList, shallowEqual);
  const recvGroupApplicationList = useSelector((state: RootState) => state.contacts.recvGroupApplicationList, shallowEqual);
  const sentFriendApplicationList = useSelector((state: RootState) => state.contacts.sentFriendApplicationList, shallowEqual);
  const recvFriendApplicationList = useSelector((state: RootState) => state.contacts.recvFriendApplicationList, shallowEqual);
  const friendList = useSelector((state: RootState) => state.contacts.friendList, shallowEqual);
  const blackList = useSelector((state: RootState) => state.contacts.blackList, shallowEqual);
  const groupList = useSelector((state: RootState) => state.contacts.groupList, shallowEqual);
  const curCve = useSelector((state: RootState) => state.cve.curCve, shallowEqual);
  const groupMemberList = useSelector((state: RootState) => state.contacts.groupMemberList, shallowEqual);

  useEffect(() => {
    window.userClick = async (id: string) => {
      if (id === selfInfo.userID) {
        events.emit(OPENSINGLEMODAL, selfInfo, "self");
        return;
      }

      if (id.indexOf("-") > -1) {
        id = id.replace("-", ".");
      }
      const { data } = await im.getUsersInfo([id]);
      events.emit(OPENSINGLEMODAL, JSON.parse(data)[0].friendInfo ?? JSON.parse(data)[0].publicInfo);
    };
    window.urlClick = (url: string) => {
      if (url.indexOf("http") === -1 && url.indexOf("https") === -1) {
        url = `http://${url}`;
      }
      window.open(url, "_blank");
    };
  }, [selfInfo]);

  useEffect(() => {
    // if (!curuid && token && userID) {
    if (token && userID) {
      setGolbalLoading(true);
      im.getLoginStatus()
        .then((res) => setGolbalLoading(false))
        .catch((err) => {
          if (token && userID) {
            imLogin();
          }
        });
    } else {
      invalid();
    }
  }, []);

  const conversationChnageHandler = (data: WsResponse) => {
    let tmpCves = cves;
    let filterArr: ConversationItem[] = [];
    const changes: ConversationItem[] = JSON.parse(data.data);
    const chids = changes.map((ch) => ch.conversationID);
    filterArr = tmpCves.filter((tc) => !chids.includes(tc.conversationID));
    const idx = changes.findIndex((c) => c.conversationID === curCve?.conversationID);
    if (idx !== -1) dispatch(setCurCve(changes[idx]));
    const result = [...changes, ...filterArr];
    dispatch(setCveList(cveSort(result)));
  };

  const newConversationHandler = (data: WsResponse) => {
    let tmpCves = cves;
    const news: ConversationItem[] = JSON.parse(data.data);
    const result = [...news, ...tmpCves];
    dispatch(setCveList(cveSort(result)));
  };

  useEffect(() => {
    im.on(CbEvents.ONCONVERSATIONCHANGED, conversationChnageHandler);
    im.on(CbEvents.ONNEWCONVERSATION, newConversationHandler);
    return () => {
      im.off(CbEvents.ONCONVERSATIONCHANGED, conversationChnageHandler);
      im.off(CbEvents.ONNEWCONVERSATION, newConversationHandler);
    };
  }, [cves, curCve]);

  const friendHandlerTemplate = (data: WsResponse, type: "info" | "added" | "deleted") => {
    const user = JSON.parse(data.data);
    const tmpArr = [...friendList];
    if (type === "info") {
      const idx = tmpArr.findIndex((f) => f.userID === user.userID);
      if (idx !== -1) tmpArr[idx] = user;
    } else if (type === "added") {
      tmpArr.push(user);
    } else {
      const idx = tmpArr.findIndex((f) => f.userID === user.userID);
      if (idx !== -1) tmpArr.splice(idx, 1);
    }
    dispatch(setFriendList(tmpArr));
  };

  const friednInfoChangeHandler = (data: WsResponse) => friendHandlerTemplate(data, "info");
  const friednAddedHandler = (data: WsResponse) => friendHandlerTemplate(data, "added");
  const friednDeletedHandler = (data: WsResponse) => friendHandlerTemplate(data, "deleted");

  useEffect(() => {
    im.on(CbEvents.ONFRIENDINFOCHANGED, friednInfoChangeHandler);
    im.on(CbEvents.ONFRIENDADDED, friednAddedHandler);
    im.on(CbEvents.ONFRIENDDELETED, friednDeletedHandler);
    return () => {
      im.off(CbEvents.ONFRIENDINFOCHANGED, friednInfoChangeHandler);
      im.off(CbEvents.ONFRIENDADDED, friednAddedHandler);
      im.off(CbEvents.ONFRIENDDELETED, friednDeletedHandler);
    };
  }, [friendList]);

  const blackAddedHandler = (data: WsResponse) => {
    const black = JSON.parse(data.data);
    const tmpBlackArr = [...blackList];
    const tmpFriendArr = [...friendList];
    const idx = tmpFriendArr.findIndex((f) => f.userID === black.userID);
    if (idx !== -1) tmpFriendArr.splice(idx, 1);
    tmpBlackArr.push(black);
    dispatch(setBlackList(tmpBlackArr));
    dispatch(setFriendList(tmpFriendArr));
  };
  const blackDeletedHandler = async (data: WsResponse) => {
    const black = JSON.parse(data.data);
    const tmpBlackArr = [...blackList];
    const tmpFriendArr = [...friendList];
    let { data: result } = await im.getDesignatedFriendsInfo([black.userID]);
    result = JSON.parse(result);
    if (result.length > 0 && result[0].friendInfo) {
      tmpFriendArr.push(result[0].friendInfo);
    }
    const delIdx = tmpBlackArr.findIndex((b) => b.userID === black.userID);
    if (delIdx !== -1) tmpBlackArr.splice(delIdx, 1);
    dispatch(setBlackList(tmpBlackArr));
    dispatch(setFriendList(tmpFriendArr));
  };

  useEffect(() => {
    im.on(CbEvents.ONBLACKADDED, blackAddedHandler);
    im.on(CbEvents.ONBLACKDELETED, blackDeletedHandler);
    return () => {
      im.off(CbEvents.ONBLACKADDED, blackAddedHandler);
      im.off(CbEvents.ONBLACKDELETED, blackDeletedHandler);
    };
  }, [blackList, friendList]);

  const isCurGroup = (gid: string) => curCve?.groupID === gid;

  const groupHandlerTemplate = (data: WsResponse, type: GruopHandlerType) => {
    const result = JSON.parse(data.data);
    const tmpArr = [...groupList];
    const idx = tmpArr.findIndex((f) => f.groupID === result.groupID);
    switch (type) {
      case "info":
        if (idx !== -1) tmpArr[idx] = result;
        if (isCurGroup(result.groupID)) dispatch(setGroupInfo(result));
        break;
      case "added":
        tmpArr.push(result);
        if (isCurGroup(result.groupID)) {
          dispatch(setGroupInfo(result));
          const options = {
            groupID: result.groupID,
            offset: 0,
            filter: 0,
            count: 2000,
          };
          dispatch(getGroupMemberList(options));
        }
        break;
      case "deleted":
        if (isCurGroup(result.groupID)) {
          tmpArr[idx].memberCount -= 1;
          dispatch(setGroupInfo(tmpArr[idx]));
        }
        if (idx !== -1) tmpArr.splice(idx, 1);
        break;
      case "memberAdded":
        if (idx !== -1) {
          tmpArr[idx].memberCount += 1;
          if (isCurGroup(result.groupID)) {
            const tempArr2 = [...groupMemberList];
            tempArr2.push(result);
            dispatch(setGroupInfo(tmpArr[idx]));
            dispatch(setGroupMemberList(tempArr2));
          }
        }
        break;
      case "memberDeleted":
        if (idx !== -1) {
          tmpArr[idx].memberCount -= 1;
          if (isCurGroup(result.groupID)) {
            const tempArr2 = [...groupMemberList];
            const delIdx = tempArr2.findIndex((m) => m.userID === result.userID);
            if (delIdx !== -1) tempArr2.splice(delIdx, 1);
            dispatch(setGroupInfo(tmpArr[idx]));
            dispatch(setGroupMemberList(tempArr2));
          }
        }
        break;
    }

    dispatch(setGroupList(tmpArr));
  };

  const joinedGroupAddedHandler = (data: WsResponse) => groupHandlerTemplate(data, "added");

  const joinedGroupDeletedHandler = (data: WsResponse) => groupHandlerTemplate(data, "deleted");

  const groupInfoChangedHandler = (data: WsResponse) => groupHandlerTemplate(data, "info");

  const groupMemberAddedHandler = (data: WsResponse) => groupHandlerTemplate(data, "memberAdded");

  const groupMemberDeletedHandler = (data: WsResponse) => groupHandlerTemplate(data, "memberDeleted");

  useEffect(() => {
    im.on(CbEvents.ONJOINEDGROUPADDED, joinedGroupAddedHandler);
    im.on(CbEvents.ONJOINEDGROUPDELETED, joinedGroupDeletedHandler);
    im.on(CbEvents.ONGROUPINFOCHANGED, groupInfoChangedHandler);
    im.on(CbEvents.ONGROUPMEMBERADDED, groupMemberAddedHandler);
    im.on(CbEvents.ONGROUPMEMBERDELETED, groupMemberDeletedHandler);
    return () => {
      im.off(CbEvents.ONJOINEDGROUPADDED, joinedGroupAddedHandler);
      im.off(CbEvents.ONJOINEDGROUPDELETED, joinedGroupDeletedHandler);
      im.off(CbEvents.ONGROUPINFOCHANGED, groupInfoChangedHandler);
      im.off(CbEvents.ONGROUPMEMBERADDED, groupMemberAddedHandler);
      im.off(CbEvents.ONGROUPMEMBERDELETED, groupMemberDeletedHandler);
    };
  }, [groupList, curCve, groupMemberList]);

  useEffect(() => {
    im.on(CbEvents.ONTOTALUNREADMESSAGECOUNTCHANGED, (data) => {
      dispatch(setUnReadCount(Number(data.data)));
    });
  }, []);

  const applicationHandlerTemplate = (data: any, failed: string, reqFlag: boolean = false) => {
    let dispatchFn = (list: any) => {};
    let tmpArr: any[] = [];
    switch (failed) {
      case "toUserID":
        dispatchFn = setSentFriendApplicationList;
        tmpArr = [...sentFriendApplicationList];
        break;
      case "fromUserID":
        dispatchFn = setRecvFriendApplicationList;
        tmpArr = [...recvFriendApplicationList];
        break;
      case "groupID":
        dispatchFn = setSentGroupApplicationList;
        tmpArr = [...sentGroupApplicationList];
        break;
      case "fromUserID":
        dispatchFn = setRecvGroupApplicationList;
        tmpArr = [...recvGroupApplicationList];
        break;
    }
    const application = JSON.parse(data.data);
    const idx = tmpArr.findIndex((a) => a[failed] === application[failed] && (reqFlag || a.reqMsg !== application.reqMsg));
    if (idx !== -1) tmpArr.splice(idx, 1);
    tmpArr.unshift(application);
    dispatch(dispatchFn(tmpArr));
  };

  const isReceivedFriendApplication = (fromUserID: string) => fromUserID !== selfInfo.userID;
  const isReceivedGroupApplication = (userID: string) => userID !== selfInfo.userID;

  const friendApplicationAddedHandler = (data: WsResponse) => {
    const application: FriendApplicationItem = JSON.parse(data.data);
    isReceivedFriendApplication(application.fromUserID) ? applicationHandlerTemplate(data, "fromUserID") : applicationHandlerTemplate(data, "toUserID");
  };
  const friendApplicationProcessedHandler = (data: WsResponse) => {
    const application: FriendApplicationItem = JSON.parse(data.data);
    isReceivedFriendApplication(application.fromUserID) ? applicationHandlerTemplate(data, "fromUserID", true) : applicationHandlerTemplate(data, "toUserID", true);
  };

  const groupApplicationAddedHandler = (data: WsResponse) => {
    const application: GroupApplicationItem = JSON.parse(data.data);
    isReceivedGroupApplication(application.userID) ? applicationHandlerTemplate(data, "userID") : applicationHandlerTemplate(data, "groupID");
  };
  const groupApplicationProcessedHandler = (data: WsResponse) => {
    const application: GroupApplicationItem = JSON.parse(data.data);
    isReceivedGroupApplication(application.userID) ? applicationHandlerTemplate(data, "userID", true) : applicationHandlerTemplate(data, "groupID", true);
  };

  useEffect(() => {
    im.on(CbEvents.ONFRIENDAPPLICATIONADDED, friendApplicationAddedHandler);
    // im.on(CbEvents.ONRECEIVEFRIENDAPPLICATIONADDED, recvFriendApplicationAddedHandler);
    im.on(CbEvents.ONFRIENDAPPLICATIONACCEPTED, friendApplicationProcessedHandler);
    im.on(CbEvents.ONFRIENDAPPLICATIONREJECTED, friendApplicationProcessedHandler);
    // im.on(CbEvents.ONFRIENDAPPLICATIONDELETED, () => {
    //   dispatch(getRecvFriendApplicationList());
    // });
    return () => {
      im.off(CbEvents.ONFRIENDAPPLICATIONADDED, friendApplicationAddedHandler);
      // im.off(CbEvents.ONRECEIVEFRIENDAPPLICATIONADDED, recvFriendApplicationAddedHandler);
      im.off(CbEvents.ONFRIENDAPPLICATIONACCEPTED, friendApplicationProcessedHandler);
      im.off(CbEvents.ONFRIENDAPPLICATIONREJECTED, friendApplicationProcessedHandler);
    };
  }, [sentFriendApplicationList, recvFriendApplicationList]);

  useEffect(() => {
    im.on(CbEvents.ONGROUPAPPLICATIONADDED, groupApplicationAddedHandler);
    // im.on(CbEvents.ONRECEIVEJOINGROUPAPPLICATIONADDED, recvGroupApplicationAddedHandler);
    im.on(CbEvents.ONGROUPAPPLICATIONACCEPTED, groupApplicationProcessedHandler);
    im.on(CbEvents.ONGROUPAPPLICATIONREJECTED, groupApplicationProcessedHandler);
    // im.on(CbEvents.ONRECEIVEJOINGROUPAPPLICATIONDELETED, () => {
    //   dispatch(getRecvGroupApplicationList());
    // });
    return () => {
      im.off(CbEvents.ONGROUPAPPLICATIONADDED, groupApplicationAddedHandler);
      // im.off(CbEvents.ONRECEIVEJOINGROUPAPPLICATIONADDED, recvGroupApplicationAddedHandler);
      im.off(CbEvents.ONGROUPAPPLICATIONACCEPTED, groupApplicationProcessedHandler);
      im.off(CbEvents.ONGROUPAPPLICATIONREJECTED, groupApplicationProcessedHandler);
    };
  }, [sentGroupApplicationList, recvGroupApplicationList]);

  const imLogin = async () => {
    let url = getIMUrl();
    let platformID = 5;
    if (window.electron) {
      url = await window.electron.getLocalWsAddress();
      // if(window.process.platform==="darwin"){
      //   platformID = 4
      // }else if(window.process.platform==="win32"){
      //   platformID = 3
      // }
    }
    const config = {
      userID,
      token,
      url,
      platformID,
    };
    im.login(config)
      .then((res) => {
        if (res.errCode !== 0) {
          invalid();
        } else {
          dispatch(getSelfInfo());
          dispatch(getCveList());
          dispatch(getFriendList());
          dispatch(getRecvFriendApplicationList());
          dispatch(getSentFriendApplicationList());
          dispatch(getGroupList());
          dispatch(getRecvGroupApplicationList());
          dispatch(getSentGroupApplicationList());
          dispatch(getUnReadCount());
          dispatch(getBlackList());
          dispatch(getAdminToken());
          setGolbalLoading(false);
        }
      })
      .catch((err) => {
        invalid();
      });
  };

  const invalid = () => {
    setGolbalLoading(false);
    message.warning("登录失效，请重新登录！");
    localStorage.removeItem(`improfile`);
    // localStorage.removeItem('lastimuid')
    navigate("/login");
  };

  const deWeightThree = (cves: ConversationItem[]) => {
    let map = new Map();
    for (let item of cves) {
      if (!map.has(item.conversationID)) {
        map.set(item.conversationID, item);
      }
    }
    return [...map.values()];
  };

  return (
    <>
      {token ? <Mylayout /> : <Navigate to="/login" />}
      <Modal
        footer={null}
        visible={golbalLoading}
        closable={false}
        centered
        className="global_loading"
        maskStyle={{
          backgroundColor: "transparent",
        }}
        bodyStyle={{
          padding: 0,
          textAlign: "center",
        }}
      >
        <Spin tip="login..." size="large" />
      </Modal>
    </>
  );
};

const RouterWrapper = ({ children }: { children: ReactNode }) => {
  return window.electron ? <HashRouter>{children}</HashRouter> : <BrowserRouter>{children}</BrowserRouter>;
};

const MyRoute = () => {
  const rootState = useSelector((state: RootState) => state, shallowEqual);

  window.onbeforeunload = function () {
    localStorage.removeItem("curimuid");
    localStorage.setItem("lastimuid", rootState.user.selfInfo.userID ?? "");
    localStorage.setItem(`${rootState.user.selfInfo.userID}userStore`, JSON.stringify(rootState.user));
    localStorage.setItem(`${rootState.user.selfInfo.userID}cveStore`, JSON.stringify(rootState.cve));
    localStorage.setItem(`${rootState.user.selfInfo.userID}consStore`, JSON.stringify(rootState.contacts));
  };

  return (
    <RouterWrapper>
      <Routes>
        <Route path="/" element={<Auth />}>
          <Route index element={<Home />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </RouterWrapper>
  );
};

export default MyRoute;
