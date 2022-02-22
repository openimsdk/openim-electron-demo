import { Dispatch } from "redux";
import { getAuthToken } from "../../api/admin";
import { im } from "../../utils";
import { FullUserItem, PartialUserItem } from "../../utils/open_im_sdk/types";
import {
  SET_SELF_INFO,
  SET_SELF_INIT_LOADING,
  SET_ADMIN_TOKEN,
  UserActionTypes,
} from "../types/user";

export const setSelfInfo = (value: PartialUserItem): UserActionTypes => {
  return {
    type: SET_SELF_INFO,
    payload: value as FullUserItem,
  };
};

export const setAdminToken = (value: string): UserActionTypes => {
  return {
    type: SET_ADMIN_TOKEN,
    payload: value,
  };
};

export const setSelfInitLoading = (value: boolean): UserActionTypes => {
  return {
    type: SET_SELF_INIT_LOADING,
    payload: value,
  };
};

export const getSelfInfo = () => {
  return (dispatch: Dispatch) => {
    dispatch(setSelfInitLoading(true));
    im.getSelfUserInfo().then((res) => {
      dispatch(setSelfInfo(JSON.parse(res.data)));
      dispatch(setSelfInitLoading(false));
    });
  };
};

export const getAdminToken = (uid?:string,secret?:string) => {
  return (dispatch: Dispatch) => {
    getAuthToken(uid,secret).then(res=>{
      dispatch(setAdminToken(res.data.token))
    })
  }
}