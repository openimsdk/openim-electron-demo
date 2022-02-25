import { CbEvents, RequestFunc } from "../constants";
import { uuid } from "../util";
import Emitter from "../event";
import {
  Ws2Promise,
  InitConfig,
  WsResponse,
  LoginParams,
  AtMsgParams,
  ImageMsgParams,
  SoundMsgParams,
  VideoMsgParams,
  FileMsgParams,
  MergerMsgParams,
  LocationMsgParams,
  CustomMsgParams,
  QuoteMsgParams,
  SendMsgParams,
  GetHistoryMsgParams,
  InsertSingleMsgParams,
  TypingUpdateParams,
  MarkC2CParams,
  GetOneCveParams,
  SetDraftParams,
  PinCveParams,
  AddFriendParams,
  InviteGroupParams,
  GetGroupMemberParams,
  CreateGroupParams,
  JoinGroupParams,
  TransferGroupParams,
  AccessGroupParams,
  WsParams,
  SplitParams,
  AccessFriendParams,
  GroupInfoParams,
  RemarkFriendParams,
  PartialUserItem,
  isRecvParams,
  SearchLocalParams,
  InsertGroupMsgParams,
} from "../types";

export default class OpenIMSDK extends Emitter {
  private ws: WebSocket | undefined;
  private uid: string | undefined;
  private token: string | undefined;
  private platform: string = "web";
  private wsUrl: string = "";
  private lock: boolean = false;
  private logoutFlag: boolean = false;
  private ws2promise: Record<string, Ws2Promise> = {};
  private onceFlag: boolean = true;

  constructor() {
    super();
    this.getPlatform();
  }

  /**
   *
   * @description init and login OpenIMSDK
   * @param uid userID
   * @param token token
   * @param url service url
   * @param platformID platformID
   * @param operationID? unique operation ID
   * @returns
   */
  login(config: InitConfig) {
    return new Promise<WsResponse>((resolve, reject) => {
      const { userID, token, url, platformID, operationID } = config;
      this.wsUrl = `${url}?sendID=${userID}&token=${token}&platformID=${platformID}`;
      const loginData = {
        userID,
        token,
      };
      let errData: WsResponse = {
        event: RequestFunc.LOGIN,
        errCode: 0,
        errMsg: "",
        data: "",
        operationID: operationID || "",
      };

      const onOpen = () => {
        this.uid = userID;
        this.token = token;
        this.iLogin(loginData, operationID)
          .then((res) => {
            this.logoutFlag = false;
            resolve(res);
          })
          .catch((err) => {
            errData.errCode = err.errCode;
            errData.errMsg = err.errMsg;
            reject(errData);
          });
      };

      const onClose = () => {
        errData.errCode = 111;
        errData.errMsg = "ws connect close...";
        if (!this.logoutFlag) this.reconnect();
        reject(errData);
      };

      const onError = (err: Error | Event) => {
        console.log(err);
        errData.errCode = 112;
        errData.errMsg = "ws connect error...";
        // if (!this.logoutFlag) this.reconnect();
        reject(errData);
      };

      this.createWs(onOpen, onClose, onError);

      if (!this.ws) {
        errData.errCode = 112;
        errData.errMsg = "The current platform is not supported...";
        reject(errData);
      }
    });
  }

  private iLogin(data: LoginParams, operationID?: string) {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.LOGIN,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  }

  logout(operationID?: string) {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.LOGOUT,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  }

  getLoginStatus = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETLOGINSTATUS,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getLoginUser = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETLOGINUSER,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getSelfUserInfo = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETSELFUSERINFO,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getUsersInfo = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETUSERSINFO,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setSelfInfo = (data: PartialUserItem, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETSELFINFO,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createTextMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATETEXTMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createTextAtMessage = (data: AtMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const tmp: any = data;
      tmp.atUserIDList = JSON.stringify(tmp.atUserIDList);
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATETEXTATMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createImageMessage = (data: ImageMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      let tmp: any = data;
      tmp.bigPicture = JSON.stringify(tmp.bigPicture);
      tmp.snapshotPicture = JSON.stringify(tmp.snapshotPicture);
      tmp.sourcePicture = JSON.stringify(tmp.sourcePicture);
      const args = {
        reqFuncName: RequestFunc.CREATEIMAGEMESSAGEFROMBYURL,
        operationID: _uuid,
        userID: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createSoundMessage = (data: SoundMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      let tmp = {
        soundBaseInfo: JSON.stringify(data),
      };
      const args = {
        reqFuncName: RequestFunc.CREATESOUNDMESSAGEBYURL,
        operationID: _uuid,
        userID: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createVideoMessage = (data: VideoMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      let tmp = {
        videoBaseInfo: JSON.stringify(data),
      };
      const args = {
        reqFuncName: RequestFunc.CREATEVIDEOMESSAGEBYURL,
        operationID: _uuid,
        userID: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createFileMessage = (data: FileMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      let tmp = {
        fileBaseInfo: JSON.stringify(data),
      };
      const args = {
        reqFuncName: RequestFunc.CREATEFILEMESSAGEBYURL,
        operationID: _uuid,
        userID: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createMergerMessage = (data: MergerMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      let tmp: any = data;
      tmp.messageList = JSON.stringify(data.messageList);
      tmp.summaryList = JSON.stringify(data.summaryList);
      const args = {
        reqFuncName: RequestFunc.CREATEMERGERMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createForwardMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATEFORWARDMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createLocationMessage = (data: LocationMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATELOCATIONMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createCustomMessage = (data: CustomMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATECUSTOMMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createQuoteMessage = (data: QuoteMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATEQUOTEMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createCardMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATECARDMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  sendMessage = (data: SendMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = data;
      tmp.offlinePushInfo = tmp.offlinePushInfo ? JSON.stringify(data.offlinePushInfo) : "";
      const args = {
        reqFuncName: RequestFunc.SENDMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  sendMessageNotOss = (data: SendMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = data;
      tmp.offlinePushInfo = tmp.offlinePushInfo ? JSON.stringify(data.offlinePushInfo) : "";
      const args = {
        reqFuncName: RequestFunc.SENDMESSAGENOTOSS,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getHistoryMessageList = (data: GetHistoryMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETHISTORYMESSAGELIST,
        operationID: _uuid,
        userID: this.uid,
        data,
      };

      this.wsSend(args, resolve, reject);
    });
  };

  revokeMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.REVOKEMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteMessageFromLocalStorage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DELETEMESSAGEFROMLOCALSTORAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  markGroupMessageHasRead = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.MARKGROUPMESSAGEHASREAD,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  insertSingleMessageToLocalStorage = (data: InsertSingleMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.INSERTSINGLEMESSAGETOLOCALSTORAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  insertGroupMessageToLocalStorage = (data: InsertGroupMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.INSERTGROUPMESSAGETOLOCALSTORAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  typingStatusUpdate = (data: TypingUpdateParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.TYPINGSTATUSUPDATE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  markC2CMessageAsRead = (data: MarkC2CParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      let tmp: any = data;
      tmp.msgIDList = JSON.stringify(tmp.msgIDList);
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.MARKC2CMESSAGEASREAD,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  clearC2CHistoryMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CLEARC2CHISTORYMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  clearGroupHistoryMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CLEARGROUPHISTORYMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getAllConversationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETALLCONVERSATIONLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getConversationListSplit = (data: SplitParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETCONVERSATIONLISTSPLIT,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getOneConversation = (data: GetOneCveParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETONECONVERSATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getConversationIDBySessionType = (data: GetOneCveParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETCONVERSATIONIDBYSESSIONTYPE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getMultipleConversation = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETMULTIPLECONVERSATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteConversation = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DELETECONVERSATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setConversationDraft = (data: SetDraftParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETCONVERSATIONDRAFT,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  pinConversation = (data: PinCveParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.PINCONVERSATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getTotalUnreadMsgCount = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETTOTALUNREADMSGCOUNT,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getConversationRecvMessageOpt = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETCONVERSATIONRECVMESSAGEOPT,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setConversationRecvMessageOpt = (data: isRecvParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = data;
      tmp.conversationIDList = JSON.stringify(data.conversationIDList);
      const args = {
        reqFuncName: RequestFunc.SETCONVERSATIONRECVMESSAGEOPT,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };

      this.wsSend(args, resolve, reject);
    });
  };

  searchLocalMessages = (data: SearchLocalParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SEARCHLOCALMESSAGES,
        operationID: _uuid,
        userID: this.uid,
        data,
      };

      this.wsSend(args, resolve, reject);
    });
  };

  addFriend = (data: AddFriendParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.ADDFRIEND,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getDesignatedFriendsInfo = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETDESIGNATEDFRIENDSINFO,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getRecvFriendApplicationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETRECVFRIENDAPPLICATIONLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getSendFriendApplicationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETSENDFRIENDAPPLICATIONLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getFriendList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETFRIENDLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setFriendRemark = (data: RemarkFriendParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETFRIENDREMARK,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  checkFriend = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CHECKFRIEND,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  acceptFriendApplication = (data: AccessFriendParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.ACCEPTFRIENDAPPLICATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  refuseFriendApplication = (data: AccessFriendParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.REFUSEFRIENDAPPLICATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteFriend = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DELETEFRIEND,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  addBlack = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.ADDBLACK,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  removeBlack = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.REMOVEBLACK,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getBlackList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETBLACKLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  inviteUserToGroup = (data: InviteGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = data;
      tmp.userIDList = JSON.stringify(tmp.userIDList);
      const args = {
        reqFuncName: RequestFunc.INVITEUSERTOGROUP,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  kickGroupMember = (data: InviteGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = data;
      tmp.userIDList = JSON.stringify(tmp.userIDList);
      const args = {
        reqFuncName: RequestFunc.KICKGROUPMEMBER,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getGroupMembersInfo = (data: Omit<InviteGroupParams, "reason">, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = data;
      tmp.userIDList = JSON.stringify(tmp.userIDList);
      const args = {
        reqFuncName: RequestFunc.GETGROUPMEMBERSINFO,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getGroupMemberList = (data: GetGroupMemberParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETGROUPMEMBERLIST,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getJoinedGroupList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETJOINEDGROUPLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createGroup = (data: CreateGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = data;
      tmp.groupBaseInfo = JSON.stringify(tmp.groupBaseInfo);
      tmp.memberList = JSON.stringify(tmp.memberList);
      const args = {
        reqFuncName: RequestFunc.CREATEGROUP,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setGroupInfo = (data: GroupInfoParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = data;
      tmp.groupInfo = JSON.stringify(tmp.groupInfo);
      const args = {
        reqFuncName: RequestFunc.SETGROUPINFO,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getGroupsInfo = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETGROUPSINFO,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  joinGroup = (data: JoinGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.JOINGROUP,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  quitGroup = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.QUITGROUP,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  transferGroupOwner = (data: TransferGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.TRANSFERGROUPOWNER,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getSendGroupApplicationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETSENDGROUPAPPLICATIONLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getRecvGroupApplicationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETRECVGROUPAPPLICATIONLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  acceptGroupApplication = (data: AccessGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.ACCEPTGROUPAPPLICATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  refuseGroupApplication = (data: AccessGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.REFUSEGROUPAPPLICATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  //tool methods

  private wsSend = (params: WsParams, resolve: (value: WsResponse | PromiseLike<WsResponse>) => void, reject: (reason?: any) => void) => {
    if (this.ws === undefined) {
      let errData: WsResponse = {
        event: params.reqFuncName,
        errCode: 112,
        errMsg: "ws conect failed...",
        data: "",
        operationID: params.operationID || "",
      };
      reject(errData);
    }
    if (typeof params.data === "object") {
      params.data = JSON.stringify(params.data);
    }

    const ws2p = {
      oid: params.operationID || uuid(this.uid as string),
      mname: params.reqFuncName,
      mrsve: resolve,
      mrjet: reject,
      flag: false,
    };

    this.ws2promise[ws2p.oid] = ws2p;

    const handleMessage = (ev: MessageEvent<string>) => {
      const data = JSON.parse(ev.data);

      if ((CbEvents as Record<string, string>)[data.event.toUpperCase()]) {
        this.emit(data.event, data);
      }

      if (params.reqFuncName === RequestFunc.LOGOUT) {
        this.logoutFlag = true;
        this.ws!.close();
        this.ws = undefined;
      }

      const callbackJob = this.ws2promise[data.operationID];
      if (!callbackJob) {
        return;
      }
      if (data.errCode === 0) {
        callbackJob.mrsve(data);
      } else {
        callbackJob.mrjet(data);
      }
      delete this.ws2promise[data.operationID];
    };

    if (this.platform == "web") {
      this.ws!.send(JSON.stringify(params));
      this.ws!.onmessage = handleMessage;
    } else {
      this.ws!.send({
        //@ts-ignore
        data: JSON.stringify(params),
        success: (res: any) => {
          //@ts-ignore
          if (
            this.platform === "uni" &&
            //@ts-ignore
            this.ws!._callbacks !== undefined &&
            //@ts-ignore
            this.ws!._callbacks.message !== undefined
          ) {
            //@ts-ignore
            this.ws!._callbacks.message = [];
          }
        },
      });
      if (this.onceFlag) {
        //@ts-ignore
        this.ws!.onMessage(handleMessage);
        this.onceFlag = false;
      }
    }
    if (params.reqFuncName === RequestFunc.LOGOUT) {
      this.onceFlag = true;
    }
  };

  private getPlatform() {
    const wflag = typeof WebSocket;
    //@ts-ignore
    const uflag = typeof uni;
    //@ts-ignore
    const xflag = typeof wx;

    if (wflag !== "undefined") {
      this.platform = "web";
      return;
    }

    if (uflag === "object" && xflag !== "object") {
      this.platform = "uni";
    } else if (uflag !== "object" && xflag === "object") {
      this.platform = "wx";
    } else {
      this.platform = "unknow";
    }
  }

  private createWs(_onOpen?: Function, _onClose?: Function, _onError?: Function) {
    console.log("call createWs:::");

    let onOpen: any = () => {
      const loginData = {
        userID: this.uid!,
        token: this.token!,
      };
      this.iLogin(loginData).then((res) => (this.logoutFlag = false));
    };

    if (_onOpen) {
      onOpen = _onOpen;
    }

    let onClose: any = () => {
      console.log("ws close agin:::");
      if (!this.logoutFlag) {
        this.reconnect();
      }
    };

    if (_onClose) {
      onClose = _onClose;
    }

    let onError: any = () => {};
    if (_onError) {
      onError = _onError;
    }

    if (this.platform === "web") {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onclose = onClose;
      this.ws.onopen = onOpen;
      this.ws.onerror = onError;
      return;
    }

    // @ts-ignore
    const platformNamespace = this.platform === "uni" ? uni : wx;
    this.ws = platformNamespace.connectSocket({
      url: this.wsUrl,
      complete: () => {},
    });
    //@ts-ignore
    this.ws.onClose(onClose);
    //@ts-ignore
    this.ws.onOpen(onOpen);
    //@ts-ignore
    this.ws.onError(onError);
  }

  private reconnect() {
    if (!this.onceFlag) this.onceFlag = true;
    if (this.lock) return;
    this.lock = true;
    setTimeout(() => {
      this.createWs();
      this.lock = false;
    }, 2000);
  }
}
