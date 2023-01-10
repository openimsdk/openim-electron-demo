export declare enum OptType {
    Nomal = 0,
    Mute = 1,
    WithoutNotify = 2
}
export declare enum AllowType {
    Allowed = 0,
    NotAllowed = 1
}
export declare enum GroupType {
    NomalGroup = 0,
    SuperGroup = 1,
    WorkingGroup = 2
}
export declare enum GroupJoinSource {
    Invitation = 2,
    Search = 3,
    QrCode = 4
}
export declare enum GroupRole {
    Nomal = 1,
    Owner = 2,
    Admin = 3
}
export declare enum GroupVerificationType {
    ApplyNeedInviteNot = 0,
    AllNeed = 1,
    AllNot = 2
}
export declare enum MessageStatus {
    Sending = 1,
    Succeed = 2,
    Failed = 3
}
export declare enum Platform {
    iOS = 1,
    Android = 2,
    Windows = 3,
    MacOSX = 4,
    Web = 5,
    Linux = 7,
    Admin = 8
}
export declare enum MessageType {
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
    BURNMESSAGECHANGE = 1701
}
export declare enum SessionType {
    Single = 1,
    Group = 2,
    SuperGroup = 3,
    Notification = 4
}
export declare enum GroupStatus {
    Nomal = 0,
    Baned = 1,
    Dismissed = 2,
    Muted = 3
}
export declare enum GroupAtType {
    AtNormal = 0,
    AtMe = 1,
    AtAll = 2,
    AtAllAtMe = 3,
    AtGroupNotice = 4
}
