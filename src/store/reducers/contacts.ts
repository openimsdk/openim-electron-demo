import { GroupItem } from "../../utils/open_im_sdk/types";
import { ContactActionTypes, ContactState, SET_BLACK_LIST, SET_FRIEND_LIST, SET_GROUP_INFO, SET_GROUP_LIST, SET_GROUP_MEMBER_LIST, SET_GROUP_MEMBER_LOADING, SET_MEMBER2STATUS, SET_ORIGIN_LIST, SET_RECV_FRIEND_APPLICATION_LIST, SET_RECV_GROUP_APPLICATION_LIST, SET_SENT_FRIEND_APPLICATION_LIST, SET_SENT_GROUP_APPLICATION_LIST, SET_UNREAD_COUNT } from "../types/contacts";

let initialState: ContactState = {
    friendList:[],
    originList:[],
    groupList:[],
    blackList:[],
    recvFriendApplicationList:[],
    sentFriendApplicationList:[],
    recvGroupApplicationList:[],
    sentGroupApplicationList:[],
    groupMemberList:[],
    groupInfo:{} as GroupItem,
    groupMemberLoading:false,
    member2status: {},
    unReadCount:0
  };
  
  const lastUid = localStorage.getItem('lastimuid') || ''
  const lastConsStore = localStorage.getItem(`${lastUid}consStore`)
  if(lastConsStore){
    initialState = JSON.parse(lastConsStore!)
  }

  export const friendReducer = (
    state = initialState,
    action: ContactActionTypes
  ): ContactState => {
    switch (action.type) {
      case SET_FRIEND_LIST:
        return { ...state, friendList: action.payload };
      case SET_ORIGIN_LIST:
        return { ...state, originList: action.payload };
      case SET_GROUP_LIST:
        return { ...state, groupList: action.payload };
      case SET_BLACK_LIST:
        return {...state,blackList: action.payload};
      case SET_RECV_FRIEND_APPLICATION_LIST:
        return { ...state, recvFriendApplicationList: action.payload };
      case SET_SENT_FRIEND_APPLICATION_LIST:
        return { ...state, sentFriendApplicationList: action.payload };
      case SET_RECV_GROUP_APPLICATION_LIST:
        return { ...state, recvGroupApplicationList: action.payload };
      case SET_SENT_GROUP_APPLICATION_LIST:
        return { ...state, sentGroupApplicationList: action.payload };
      case SET_GROUP_MEMBER_LIST:
        return { ...state, groupMemberList: action.payload };
      case SET_GROUP_INFO:
        return { ...state, groupInfo: action.payload };
      case SET_GROUP_MEMBER_LOADING:
        return { ...state, groupMemberLoading: action.payload };
      case SET_MEMBER2STATUS:
        return { ...state, member2status: action.payload };
      case SET_UNREAD_COUNT:
        return { ...state, unReadCount: action.payload };
      default:
        return state;
    }
  };