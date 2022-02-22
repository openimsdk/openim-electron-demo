import { Dispatch } from "redux";
import { MemberMapType } from "../../@types/open_im";
import { im } from "../../utils";
import { BlackItem, FriendApplicationItem, FriendItem, GetGroupMemberParams, GroupApplicationItem, GroupItem, GroupMemberItem, TotalUserStruct } from "../../utils/open_im_sdk/types";
import {
  ContactActionTypes,
  SET_BLACK_LIST,
  SET_RECV_FRIEND_APPLICATION_LIST,
  SET_SENT_FRIEND_APPLICATION_LIST,
  SET_FRIEND_LIST,
  SET_RECV_GROUP_APPLICATION_LIST,
  SET_SENT_GROUP_APPLICATION_LIST,
  SET_GROUP_LIST,
  SET_GROUP_MEMBER_LIST,
  SET_GROUP_MEMBER_LOADING,
  SET_MEMBER2STATUS,
  SET_ORIGIN_LIST,
  SET_UNREAD_COUNT,
  SET_GROUP_INFO,
} from "../types/contacts";

export const setFriendList = (value: FriendItem[]): ContactActionTypes => {
  return {
    type: SET_FRIEND_LIST,
    payload: value,
  };
};

export const setOriginList = (value: FriendItem[]): ContactActionTypes => {
  return {
    type: SET_ORIGIN_LIST,
    payload: value,
  };
};

export const setGroupList = (value: GroupItem[]): ContactActionTypes => {
  return {
    type: SET_GROUP_LIST,
    payload: value,
  };
};

export const setBlackList = (value: BlackItem[]): ContactActionTypes => {
  return {
    type: SET_BLACK_LIST,
    payload: value,
  };
};

export const setRecvFriendApplicationList = (value: FriendApplicationItem[]): ContactActionTypes => {
  return {
    type: SET_RECV_FRIEND_APPLICATION_LIST,
    payload: value,
  };
};

export const setSentFriendApplicationList = (value: FriendApplicationItem[]): ContactActionTypes => {
  return {
    type: SET_SENT_FRIEND_APPLICATION_LIST,
    payload: value,
  };
};

export const setRecvGroupApplicationList = (value: GroupApplicationItem[]): ContactActionTypes => {
  return {
    type: SET_RECV_GROUP_APPLICATION_LIST,
    payload: value,
  };
};

export const setSentGroupApplicationList = (value: GroupApplicationItem[]): ContactActionTypes => {
  return {
    type: SET_SENT_GROUP_APPLICATION_LIST,
    payload: value,
  };
};

export const setGroupMemberList = (value: GroupMemberItem[]): ContactActionTypes => {
  return {
    type: SET_GROUP_MEMBER_LIST,
    payload: value,
  };
};

export const setGroupInfo = (value: GroupItem): ContactActionTypes => {
  return {
    type: SET_GROUP_INFO,
    payload: value,
  };
};

export const setGroupMemberLoading = (value: boolean): ContactActionTypes => {
  return {
    type: SET_GROUP_MEMBER_LOADING,
    payload: value,
  };
};

export const setMember2Status = (value: MemberMapType): ContactActionTypes => {
  return {
    type: SET_MEMBER2STATUS,
    payload: value,
  };
};

export const setUnReadCount = (value: number): ContactActionTypes => {
  return {
    type: SET_UNREAD_COUNT,
    payload: value,
  };
};

export const getFriendList = () => {
  return (dispatch: Dispatch) => {
    im.getFriendList().then((res) => {
      let tmp:FriendItem[] = []
      JSON.parse(res.data).forEach((item:TotalUserStruct)=>!item.blackInfo&&tmp.push(item.friendInfo!))
      dispatch(setFriendList(tmp))
    });
  };
};

export const getGroupList = () => {
  return (dispatch: Dispatch) => {
    im.getJoinedGroupList().then((res) => dispatch(setGroupList(JSON.parse(res.data))));
  };
};

export const getBlackList = () => {
  return (dispatch: Dispatch) => {
    im.getBlackList().then((res) =>{
      dispatch(setBlackList(JSON.parse(res.data)))
    });
  };
};

export const getRecvFriendApplicationList = () => {
  return (dispatch: Dispatch) => {
    im.getRecvFriendApplicationList().then((res) => dispatch(setRecvFriendApplicationList(JSON.parse(res.data))));
  };
};

export const getSentFriendApplicationList = () => {
  return (dispatch: Dispatch) => {
    im.getSendFriendApplicationList().then((res) => dispatch(setSentFriendApplicationList(JSON.parse(res.data))));
  };
};

export const getRecvGroupApplicationList = () => {
  return (dispatch: Dispatch) => {
    im.getRecvGroupApplicationList().then((res) => dispatch(setRecvGroupApplicationList(JSON.parse(res.data))));
  };
};

export const getSentGroupApplicationList = () => {
  return (dispatch: Dispatch) => {
    im.getSendGroupApplicationList().then((res) => dispatch(setSentGroupApplicationList(JSON.parse(res.data))));
  };
};

export const getGroupMemberList = (options: GetGroupMemberParams) => {
  return (dispatch: Dispatch) => {
    dispatch(setGroupMemberLoading(true));
    im.getGroupMemberList(options).then((res) => {
      dispatch(setGroupMemberList(JSON.parse(res.data)));
      dispatch(setGroupMemberLoading(false));
    });
  };
};

export const getGroupInfo = (gid:string) => {
  return (dispatch: Dispatch) => {
    im.getGroupsInfo([gid]).then((res) =>{
      dispatch(setGroupInfo(JSON.parse(res.data)[0]))
    }).catch(err => dispatch(setGroupInfo({} as GroupItem)));
  }
}

export const getUnReadCount = () => {
  return (dispatch: Dispatch) => {
    im.getTotalUnreadMsgCount().then((res) => {
      dispatch(setUnReadCount(Number(res.data)));
    });
  };
};
