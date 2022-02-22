export type Itype = "login" | "register" | "vericode" | "setPwd" | "setInfo" | "success" | "modifycode" | "modify" | "modifySend";

export type WrapFriendApplicationItem = FriendApplicationItem & { flag?: number }
export type WrapGroupApplicationItem = GroupApplicationItem & { flag?: number }
// export type Cve = {
//   conversationID: string;
//   conversationType: number;
//   draftText: string;
//   draftTimestamp: number;
//   faceUrl: string;
//   groupID: string;
//   isPinned: number;
//   latestMsg: string;
//   latestMsgSendTime: number;
//   recvMsgOpt: number;
//   showName: string;
//   unreadCount: number;
//   userID: string;
// };

// export type FriendItem = {
//   uid: string;
//   name: string;
//   icon: string;
//   gender: number;
//   mobile: string;
//   birth: string;
//   email: string;
//   ex: string;
//   comment: string;
//   isInBlackList: number;
// };

// export type GroupItem = {
//   groupID: string;
//   groupName: string;
//   notification: string;
//   introduction: string;
//   faceUrl: string;
//   ex: string;
//   ownerId: string;
//   createTime: number;
//   memberCount: number;
// };

// export type Message = {
//   clientMsgID: string;
//   serverMsgID: string;
//   createTime: number;
//   sendTime: number;
//   sessionType: number;
//   sendID: string;
//   recvID: string;
//   msgFrom: number;
//   contentType: number;
//   platformID: number;
//   forceList: string | null;
//   senderNickName: string;
//   senderFaceUrl: string;
//   groupID: string;
//   content: string;
//   seq: number;
//   isRead: boolean;
//   status: number;
//   remark: string;
//   pictureElem: PictureElem;
//   soundElem: SoundElem;
//   videoElem: VideoElem;
//   fileElem: FileElem;
//   mergeElem: MergeElem;
//   atElem: AtElem;
//   locationElem: LocationElem;
//   customElem: CustomElem;
//   quoteElem: QuoteElem;
// };

// export type AtElem = {
//   text: string;
//   atUserList: string[] | null;
//   isAtSelf: boolean;
// };

// export type CustomElem = {
//   data: string;
//   description: string;
//   extension: string;
// };

// export type FileElem = {
//   filePath: string;
//   uuid: string;
//   sourceUrl: string;
//   fileName: string;
//   fileSize: number;
// };

// export type LocationElem = {
//   description: string;
//   longitude: number;
//   latitude: number;
// };

// export type MergeElem = {
//   title: string;
//   abstractList: string[] | null;
//   multiMessage: Message[];
// };

// export type PictureElem = {
//   sourcePath: string;
//   sourcePicture: Picture;
//   bigPicture: Picture;
//   snapshotPicture: Picture;
// };

// export type Picture = {
//   uuid: string;
//   type: string;
//   size: number;
//   width: number;
//   height: number;
//   url: string;
// };

// export type QuoteElem = {
//   quoteMessage: Message;
//   text: string;
// };

// export type SoundElem = {
//   uuid: string;
//   soundPath: string;
//   sourceUrl: string;
//   dataSize: number;
//   duration: number;
// };

// export type VideoElem = {
//   videoPath: string;
//   videoUUID: string;
//   videoUrl: string;
//   videoType: string;
//   videoSize: number;
//   duration: number;
//   snapshotPath: string;
//   snapshotUUID: string;
//   snapshotSize: number;
//   snapshotUrl: string;
//   snapshotWidth: number;
//   snapshotHeight: number;
// };

// export type FriendApplication = {
//   applyTime: string;
//   birth: string;
//   email: string;
//   ex: string;
//   flag: number;
//   gender: number;
//   icon: string;
//   mobile: string;
//   name: string;
//   reqMessage: string;
//   uid: string;
// };

// export type GroupApplication = {
//   createTime: number;
//   flag: number;
//   fromUserFaceURL: string;
//   fromUserID: string;
//   fromUserNickName: string;
//   groupID: string;
//   handleResult: number;
//   handleStatus: number;
//   handledMsg: string;
//   handledUser: string;
//   id: string;
//   reqMsg: string;
//   toUserFaceURL: string;
//   toUserID: string;
//   toUserNickName: string;
//   type: number;
// };

// export type GroupItem = {
//   createTime: number;
//   ex: string;
//   faceUrl: string;
//   groupID: string;
//   groupName: string;
//   introduction: string;
//   memberCount: number;
//   notification: string;
//   ownerId: string;
// };

// export type GroupMember = {
//   faceUrl: string;
//   groupID: string;
//   joinTime: number;
//   nickName: string;
//   role: number;
//   userId: string;
//   status?: string;
// };

// api
export type StringMapType = {
  [name: string]: string;
};

export type String2IMGType = {
  [name: string]: File;
};

export type MemberMapType = {
  [userID: string]: ResItemType;
};

export type OnLineResType = {
  errCode: number;
  errMsg: string;
  data: ResItemType[];
};

export type ResItemType = {
  status: string;
  userID: string;
  detailPlatformStatus?: DetailType[];
};

export type DetailType = {
  platform: string;
  status: string;
};

export type LanguageType = "zh-cn" | "en";