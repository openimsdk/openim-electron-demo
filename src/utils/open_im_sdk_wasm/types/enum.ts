export enum OptType {
  Nomal = 0,
  Mute = 1,
  WithoutNotify = 2,
}

export enum AllowType {
  Allowed,
  NotAllowed,
}

export enum GroupType {
  NomalGroup,
  SuperGroup,
  WorkingGroup,
}

export enum GroupJoinSource {
  Invitation = 2,
  Search = 3,
  QrCode = 4,
}

export enum GroupRole {
  Nomal = 1,
  Owner = 2,
  Admin = 3,
}

export enum GroupVerificationType {
  ApplyNeedInviteNot,
  AllNeed,
  AllNot,
}

export enum MessageStatus {
  Sending = 1,
  Succeed = 2,
  Failed = 3,
}

export enum Platform {
  iOS = 1,
  Android = 2,
  Windows = 3,
  MacOSX = 4,
  Web = 5,
  Linux = 7,
  Admin = 8,
}

export enum MessageType {
  TEXTMESSAGE = 101,
  PICTUREMESSAGE = 102,
  VOICEMESSAGE = 103,
  VIDEOMESSAGE = 104,
  FILEMESSAGE = 105,
  ATTEXTMESSAGE = 106,
  MERGERMESSAGE = 107,
  CARDMESSAGE = 108,
  LOCATIONMESSAGE = 109,
  CUSTOMMESSAGE = 110,
  REVOKEMESSAGE = 111,
  HASREADRECEIPTMESSAGE = 112,
  TYPINGMESSAGE = 113,
  QUOTEMESSAGE = 114,
  FACEMESSAGE = 115,
  ADVANCEREVOKEMESSAGE = 118,
  FRIENDAPPLICATIONAPPROVED = 1201,
  FRIENDAPPLICATIONREJECTED = 1202,
  FRIENDAPPLICATIONADDED = 1203,
  FRIENDADDED = 1204,
  FRIENDDELETED = 1205,
  FRIENDREMARKSET = 1206,
  BLACKADDED = 1207,
  BLACKDELETED = 1208,
  SELFINFOUPDATED = 1303,
  NOTIFICATION = 1400,
  GROUPCREATED = 1501,
  GROUPINFOUPDATED = 1502,
  JOINGROUPAPPLICATIONADDED = 1503,
  MEMBERQUIT = 1504,
  GROUPAPPLICATIONACCEPTED = 1505,
  GROUPAPPLICATIONREJECTED = 1506,
  GROUPOWNERTRANSFERRED = 1507,
  MEMBERKICKED = 1508,
  MEMBERINVITED = 1509,
  MEMBERENTER = 1510,
  GROUPDISMISSED = 1511,
  GROUPMEMBERMUTED = 1512,
  GROUPMEMBERCANCELMUTED = 1513,
  GROUPMUTED = 1514,
  GROUPCANCELMUTED = 1515,
  GROUPMEMBERINFOUPDATED = 1516,
  BURNMESSAGECHANGE = 1701,
}

export enum SessionType {
  Single = 1,
  Group = 2,
  SuperGroup = 3,
  Notification = 4,
}
