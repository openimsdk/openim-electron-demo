type SplitResponse = {
  currentPage: number;
  showNumber: number;
};

export type WorkMoments = {
  workMomentID: string;
  userID: string;
  content: string;
  likeUsers: Users[];
  comments: Comments[];
  faceURL: string;
  userName: string;
  atUsers: Users[];
  permissionUsers: Users[];
  createTime: number;
  permission: number;
};

export type Content = {
  // 0图文 1视频
  type: 0 | 1;
  text: string;
  metas: {
    thumb: string;
    original: string;
  }[];
};

export type Users = {
  userID: string;
  userName: string;
};

export type Comments = {
  userID: string;
  userName: string;
  replyUserID: string;
  replyUserName: string;
  contentID: string;
  content: string;
  createTime: number;
};

export type WorkMomentsResponse = {
  workMoments: WorkMoments[];
} & SplitResponse;
