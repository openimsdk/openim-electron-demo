export var MessageReceiveOptType;
(function (MessageReceiveOptType) {
    MessageReceiveOptType[MessageReceiveOptType["Nomal"] = 0] = "Nomal";
    MessageReceiveOptType[MessageReceiveOptType["NotReceive"] = 1] = "NotReceive";
    MessageReceiveOptType[MessageReceiveOptType["NotNotify"] = 2] = "NotNotify";
})(MessageReceiveOptType || (MessageReceiveOptType = {}));
export var AllowType;
(function (AllowType) {
    AllowType[AllowType["Allowed"] = 0] = "Allowed";
    AllowType[AllowType["NotAllowed"] = 1] = "NotAllowed";
})(AllowType || (AllowType = {}));
export var GroupType;
(function (GroupType) {
    GroupType[GroupType["WorkingGroup"] = 2] = "WorkingGroup";
})(GroupType || (GroupType = {}));
export var GroupJoinSource;
(function (GroupJoinSource) {
    GroupJoinSource[GroupJoinSource["Invitation"] = 2] = "Invitation";
    GroupJoinSource[GroupJoinSource["Search"] = 3] = "Search";
    GroupJoinSource[GroupJoinSource["QrCode"] = 4] = "QrCode";
})(GroupJoinSource || (GroupJoinSource = {}));
export var GroupMemberRole;
(function (GroupMemberRole) {
    GroupMemberRole[GroupMemberRole["Nomal"] = 20] = "Nomal";
    GroupMemberRole[GroupMemberRole["Admin"] = 60] = "Admin";
    GroupMemberRole[GroupMemberRole["Owner"] = 100] = "Owner";
})(GroupMemberRole || (GroupMemberRole = {}));
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
    Platform[Platform["AndroidPad"] = 8] = "AndroidPad";
    Platform[Platform["iPad"] = 9] = "iPad";
})(Platform || (Platform = {}));
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Debug"] = 5] = "Debug";
    LogLevel[LogLevel["Info"] = 4] = "Info";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Error"] = 2] = "Error";
    LogLevel[LogLevel["Fatal"] = 1] = "Fatal";
    LogLevel[LogLevel["Panic"] = 0] = "Panic";
})(LogLevel || (LogLevel = {}));
export var ApplicationHandleResult;
(function (ApplicationHandleResult) {
    ApplicationHandleResult[ApplicationHandleResult["Unprocessed"] = 0] = "Unprocessed";
    ApplicationHandleResult[ApplicationHandleResult["Agree"] = 1] = "Agree";
    ApplicationHandleResult[ApplicationHandleResult["Reject"] = -1] = "Reject";
})(ApplicationHandleResult || (ApplicationHandleResult = {}));
export var MessageType;
(function (MessageType) {
    MessageType[MessageType["TextMessage"] = 101] = "TextMessage";
    MessageType[MessageType["PictureMessage"] = 102] = "PictureMessage";
    MessageType[MessageType["VoiceMessage"] = 103] = "VoiceMessage";
    MessageType[MessageType["VideoMessage"] = 104] = "VideoMessage";
    MessageType[MessageType["FileMessage"] = 105] = "FileMessage";
    MessageType[MessageType["AtTextMessage"] = 106] = "AtTextMessage";
    MessageType[MessageType["MergeMessage"] = 107] = "MergeMessage";
    MessageType[MessageType["CardMessage"] = 108] = "CardMessage";
    MessageType[MessageType["LocationMessage"] = 109] = "LocationMessage";
    MessageType[MessageType["CustomMessage"] = 110] = "CustomMessage";
    MessageType[MessageType["TypingMessage"] = 113] = "TypingMessage";
    MessageType[MessageType["QuoteMessage"] = 114] = "QuoteMessage";
    MessageType[MessageType["FaceMessage"] = 115] = "FaceMessage";
    MessageType[MessageType["FriendAdded"] = 1201] = "FriendAdded";
    MessageType[MessageType["OANotification"] = 1400] = "OANotification";
    MessageType[MessageType["GroupCreated"] = 1501] = "GroupCreated";
    MessageType[MessageType["GroupInfoUpdated"] = 1502] = "GroupInfoUpdated";
    MessageType[MessageType["MemberQuit"] = 1504] = "MemberQuit";
    MessageType[MessageType["GroupOwnerTransferred"] = 1507] = "GroupOwnerTransferred";
    MessageType[MessageType["MemberKicked"] = 1508] = "MemberKicked";
    MessageType[MessageType["MemberInvited"] = 1509] = "MemberInvited";
    MessageType[MessageType["MemberEnter"] = 1510] = "MemberEnter";
    MessageType[MessageType["GroupDismissed"] = 1511] = "GroupDismissed";
    MessageType[MessageType["GroupMemberMuted"] = 1512] = "GroupMemberMuted";
    MessageType[MessageType["GroupMemberCancelMuted"] = 1513] = "GroupMemberCancelMuted";
    MessageType[MessageType["GroupMuted"] = 1514] = "GroupMuted";
    MessageType[MessageType["GroupCancelMuted"] = 1515] = "GroupCancelMuted";
    MessageType[MessageType["GroupMemberInfoUpdated"] = 1516] = "GroupMemberInfoUpdated";
    MessageType[MessageType["GroupMemberToAdmin"] = 1517] = "GroupMemberToAdmin";
    MessageType[MessageType["GroupAdminToNomal"] = 1518] = "GroupAdminToNomal";
    MessageType[MessageType["GroupAnnouncementUpdated"] = 1519] = "GroupAnnouncementUpdated";
    MessageType[MessageType["GroupNameUpdated"] = 1520] = "GroupNameUpdated";
    MessageType[MessageType["BurnMessageChange"] = 1701] = "BurnMessageChange";
    // notification
    MessageType[MessageType["RevokeMessage"] = 2101] = "RevokeMessage";
    MessageType[MessageType["HasReadReceiptMessage"] = 2150] = "HasReadReceiptMessage";
    MessageType[MessageType["GroupHasReadReceipt"] = 2155] = "GroupHasReadReceipt";
})(MessageType || (MessageType = {}));
export var SessionType;
(function (SessionType) {
    SessionType[SessionType["Single"] = 1] = "Single";
    SessionType[SessionType["Group"] = 2] = "Group";
    SessionType[SessionType["WorkingGroup"] = 3] = "WorkingGroup";
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
export var GroupMemberFilter;
(function (GroupMemberFilter) {
    GroupMemberFilter[GroupMemberFilter["All"] = 0] = "All";
    GroupMemberFilter[GroupMemberFilter["Owner"] = 1] = "Owner";
    GroupMemberFilter[GroupMemberFilter["Admin"] = 2] = "Admin";
    GroupMemberFilter[GroupMemberFilter["Nomal"] = 3] = "Nomal";
    GroupMemberFilter[GroupMemberFilter["AdminAndNomal"] = 4] = "AdminAndNomal";
    GroupMemberFilter[GroupMemberFilter["AdminAndOwner"] = 5] = "AdminAndOwner";
})(GroupMemberFilter || (GroupMemberFilter = {}));
export var Relationship;
(function (Relationship) {
    Relationship[Relationship["isBlack"] = 0] = "isBlack";
    Relationship[Relationship["isFriend"] = 1] = "isFriend";
})(Relationship || (Relationship = {}));
export var LoginStatus;
(function (LoginStatus) {
    LoginStatus[LoginStatus["Logout"] = 1] = "Logout";
    LoginStatus[LoginStatus["Logging"] = 2] = "Logging";
    LoginStatus[LoginStatus["Logged"] = 3] = "Logged";
})(LoginStatus || (LoginStatus = {}));
export var OnlineState;
(function (OnlineState) {
    OnlineState[OnlineState["Online"] = 1] = "Online";
    OnlineState[OnlineState["Offline"] = 0] = "Offline";
})(OnlineState || (OnlineState = {}));
