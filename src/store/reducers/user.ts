import { FullUserItem } from "../../utils/open_im_sdk/types";
import { SET_SELF_INFO, SET_SELF_INIT_LOADING, SET_ADMIN_TOKEN, UserActionTypes, UserState } from "../types/user";

let initialState: UserState = {
    selfInfo:{} as FullUserItem,
    adminToken:"",
    selfInitLoading:true
  };

  const lastUid = localStorage.getItem('lastimuid') || ''
  const lastUserStore = localStorage.getItem(`${lastUid}userStore`)
  if(lastUserStore){
    initialState = JSON.parse(lastUserStore!)
  }
  
  export const userReducer = (
    state = initialState,
    action: UserActionTypes
  ): UserState => {
    switch (action.type) {
      case SET_SELF_INFO:
        return { ...state, selfInfo: {...state.selfInfo,...action.payload} };
      case SET_ADMIN_TOKEN:
        return { ...state, adminToken: action.payload };
      case SET_SELF_INIT_LOADING:
        return { ...state, selfInitLoading: action.payload };
      default:
        return state;
    }
  };