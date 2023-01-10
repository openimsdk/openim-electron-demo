export var OptType;
(function (OptType) {
    OptType[OptType["Nomal"] = 0] = "Nomal";
    OptType[OptType["Mute"] = 1] = "Mute";
    OptType[OptType["WithoutNotify"] = 2] = "WithoutNotify";
})(OptType || (OptType = {}));
export var AllowType;
(function (AllowType) {
    AllowType[AllowType["Allowed"] = 0] = "Allowed";
    AllowType[AllowType["NotAllowed"] = 1] = "NotAllowed";
})(AllowType || (AllowType = {}));
export var GroupType;
(function (GroupType) {
    GroupType[GroupType["NomalGroup"] = 0] = "NomalGroup";
    GroupType[GroupType["SuperGroup"] = 1] = "SuperGroup";
    GroupType[GroupType["WorkingGroup"] = 2] = "WorkingGroup";
})(GroupType || (GroupType = {}));
export var GroupJoinSource;
(function (GroupJoinSource) {
    GroupJoinSource[GroupJoinSource["Invitation"] = 2] = "Invitation";
    GroupJoinSource[GroupJoinSource["Search"] = 3] = "Search";
    GroupJoinSource[GroupJoinSource["QrCode"] = 4] = "QrCode";
})(GroupJoinSource || (GroupJoinSource = {}));
export var GroupRole;
(function (GroupRole) {
    GroupRole[GroupRole["Nomal"] = 1] = "Nomal";
    GroupRole[GroupRole["Owner"] = 2] = "Owner";
    GroupRole[GroupRole["Admin"] = 3] = "Admin";
})(GroupRole || (GroupRole = {}));
export var GroupVerificationType;
(function (GroupVerificationType) {
    GroupVerificationType[GroupVerificationType["ApplyNeedInviteNot"] = 0] = "ApplyNeedInviteNot";
    GroupVerificationType[GroupVerificationType["AllNeed"] = 1] = "AllNeed";
    GroupVerificationType[GroupVerificationType["AllNot"] = 2] = "AllNot";
})(GroupVerificationType || (GroupVerificationType = {}));
export var MessageStatus;
(function (MessageStatus) {
    MessageStatus[MessageStatus["Sending"] = 1] = "Sending";
    MessageStatus[MessageStatus["Succeed"] = 2] = "Succeed";
    MessageStatus[MessageStatus["Failed"] = 3] = "Failed";
})(MessageStatus || (MessageStatus = {}));
export var Platform;
(function (Platform) {
    Platform[Platform["iOS"] = 1] = "iOS";
    Platform[Platform["Android"] = 2] = "Android";
    Platform[Platform["Windows"] = 3] = "Windows";
    Platform[Platform["MacOSX"] = 4] = "MacOSX";
    Platform[Platform["Web"] = 5] = "Web";
    Platform[Platform["Linux"] = 7] = "Linux";
    Platform[Platform["Admin"] = 8] = "Admin";
})(Platform || (Platform = {}));
export var MessageType;
(function (MessageType) {
    MessageType[MessageType["TEXTMESSAGE"] = 101] = "TEXTMESSAGE";
    MessageType[MessageType["PICTUREMESSAGE"] = 102] = "PICTUREMESSAGE";
    MessageType[MessageType["VOICEMESSAGE"] = 103] = "VOICEMESSAGE";
    MessageType[MessageType["VIDEOMESSAGE"] = 104] = "VIDEOMESSAGE";
    MessageType[MessageType["FILEMESSAGE"] = 105] = "FILEMESSAGE";
    MessageType[MessageType["ATTEXTMESSAGE"] = 106] = "ATTEXTMESSAGE";
    MessageType[MessageType["MERGERMESSAGE"] = 107] = "MERGERMESSAGE";
    MessageType[MessageType["CARDMESSAGE"] = 108] = "CARDMESSAGE";
    MessageType[MessageType["LOCATIONMESSAGE"] = 109] = "LOCATIONMESSAGE";
    MessageType[MessageType["CUSTOMMESSAGE"] = 110] = "CUSTOMMESSAGE";
    MessageType[MessageType["REVOKEMESSAGE"] = 111] = "REVOKEMESSAGE";
    MessageType[MessageType["HASREADRECEIPTMESSAGE"] = 112] = "HASREADRECEIPTMESSAGE";
    MessageType[MessageType["TYPINGMESSAGE"] = 113] = "TYPINGMESSAGE";
    MessageType[MessageType["QUOTEMESSAGE"] = 114] = "QUOTEMESSAGE";
    MessageType[MessageType["FACEMESSAGE"] = 115] = "FACEMESSAGE";
    MessageType[MessageType["ADVANCEREVOKEMESSAGE"] = 118] = "ADVANCEREVOKEMESSAGE";
    MessageType[MessageType["FRIENDAPPLICATIONAPPROVED"] = 1201] = "FRIENDAPPLICATIONAPPROVED";
    MessageType[MessageType["FRIENDAPPLICATIONREJECTED"] = 1202] = "FRIENDAPPLICATIONREJECTED";
    MessageType[MessageType["FRIENDAPPLICATIONADDED"] = 1203] = "FRIENDAPPLICATIONADDED";
    MessageType[MessageType["FRIENDADDED"] = 1204] = "FRIENDADDED";
    MessageType[MessageType["FRIENDDELETED"] = 1205] = "FRIENDDELETED";
    MessageType[MessageType["FRIENDREMARKSET"] = 1206] = "FRIENDREMARKSET";
    MessageType[MessageType["BLACKADDED"] = 1207] = "BLACKADDED";
    MessageType[MessageType["BLACKDELETED"] = 1208] = "BLACKDELETED";
    MessageType[MessageType["SELFINFOUPDATED"] = 1303] = "SELFINFOUPDATED";
    MessageType[MessageType["NOTIFICATION"] = 1400] = "NOTIFICATION";
    MessageType[MessageType["GROUPCREATED"] = 1501] = "GROUPCREATED";
    MessageType[MessageType["GROUPINFOUPDATED"] = 1502] = "GROUPINFOUPDATED";
    MessageType[MessageType["JOINGROUPAPPLICATIONADDED"] = 1503] = "JOINGROUPAPPLICATIONADDED";
    MessageType[MessageType["MEMBERQUIT"] = 1504] = "MEMBERQUIT";
    MessageType[MessageType["GROUPAPPLICATIONACCEPTED"] = 1505] = "GROUPAPPLICATIONACCEPTED";
    MessageType[MessageType["GROUPAPPLICATIONREJECTED"] = 1506] = "GROUPAPPLICATIONREJECTED";
    MessageType[MessageType["GROUPOWNERTRANSFERRED"] = 1507] = "GROUPOWNERTRANSFERRED";
    MessageType[MessageType["MEMBERKICKED"] = 1508] = "MEMBERKICKED";
    MessageType[MessageType["MEMBERINVITED"] = 1509] = "MEMBERINVITED";
    MessageType[MessageType["MEMBERENTER"] = 1510] = "MEMBERENTER";
    MessageType[MessageType["GROUPDISMISSED"] = 1511] = "GROUPDISMISSED";
    MessageType[MessageType["GROUPMEMBERMUTED"] = 1512] = "GROUPMEMBERMUTED";
    MessageType[MessageType["GROUPMEMBERCANCELMUTED"] = 1513] = "GROUPMEMBERCANCELMUTED";
    MessageType[MessageType["GROUPMUTED"] = 1514] = "GROUPMUTED";
    MessageType[MessageType["GROUPCANCELMUTED"] = 1515] = "GROUPCANCELMUTED";
    MessageType[MessageType["GROUPMEMBERINFOUPDATED"] = 1516] = "GROUPMEMBERINFOUPDATED";
    MessageType[MessageType["BURNMESSAGECHANGE"] = 1701] = "BURNMESSAGECHANGE";
})(MessageType || (MessageType = {}));
export var SessionType;
(function (SessionType) {
    SessionType[SessionType["Single"] = 1] = "Single";
    SessionType[SessionType["Group"] = 2] = "Group";
    SessionType[SessionType["SuperGroup"] = 3] = "SuperGroup";
    SessionType[SessionType["Notification"] = 4] = "Notification";
})(SessionType || (SessionType = {}));
export var GroupStatus;
(function (GroupStatus) {
    GroupStatus[GroupStatus["Nomal"] = 0] = "Nomal";
    GroupStatus[GroupStatus["Baned"] = 1] = "Baned";
    GroupStatus[GroupStatus["Dismissed"] = 2] = "Dismissed";
    GroupStatus[GroupStatus["Muted"] = 3] = "Muted";
})(GroupStatus || (GroupStatus = {}));
export var GroupAtType;
(function (GroupAtType) {
    GroupAtType[GroupAtType["AtNormal"] = 0] = "AtNormal";
    GroupAtType[GroupAtType["AtMe"] = 1] = "AtMe";
    GroupAtType[GroupAtType["AtAll"] = 2] = "AtAll";
    GroupAtType[GroupAtType["AtAllAtMe"] = 3] = "AtAllAtMe";
    GroupAtType[GroupAtType["AtGroupNotice"] = 4] = "AtGroupNotice";
})(GroupAtType || (GroupAtType = {}));
