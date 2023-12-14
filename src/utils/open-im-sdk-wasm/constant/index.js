export const DatabaseErrorCode = {
    ErrorInit: 10001,
    ErrorNoRecord: 10002,
    ErrorDBTimeout: 10003,
};
export var CbEvents;
(function (CbEvents) {
    CbEvents["Login"] = "Login";
    CbEvents["OnConnectFailed"] = "OnConnectFailed";
    CbEvents["OnConnectSuccess"] = "OnConnectSuccess";
    CbEvents["OnConnecting"] = "OnConnecting";
    CbEvents["OnKickedOffline"] = "OnKickedOffline";
    CbEvents["OnSelfInfoUpdated"] = "OnSelfInfoUpdated";
    CbEvents["OnUserTokenExpired"] = "OnUserTokenExpired";
    CbEvents["OnProgress"] = "OnProgress";
    CbEvents["OnRecvNewMessage"] = "OnRecvNewMessage";
    CbEvents["OnRecvNewMessages"] = "OnRecvNewMessages";
    CbEvents["OnRecvMessageRevoked"] = "OnRecvMessageRevoked";
    CbEvents["OnNewRecvMessageRevoked"] = "OnNewRecvMessageRevoked";
    CbEvents["OnRecvC2CReadReceipt"] = "OnRecvC2CReadReceipt";
    CbEvents["OnRecvGroupReadReceipt"] = "OnRecvGroupReadReceipt";
    CbEvents["OnConversationChanged"] = "OnConversationChanged";
    CbEvents["OnNewConversation"] = "OnNewConversation";
    CbEvents["OnSyncServerFailed"] = "OnSyncServerFailed";
    CbEvents["OnSyncServerFinish"] = "OnSyncServerFinish";
    CbEvents["OnSyncServerStart"] = "OnSyncServerStart";
    CbEvents["OnTotalUnreadMessageCountChanged"] = "OnTotalUnreadMessageCountChanged";
    CbEvents["OnBlackAdded"] = "OnBlackAdded";
    CbEvents["OnBlackDeleted"] = "OnBlackDeleted";
    CbEvents["OnFriendApplicationAccepted"] = "OnFriendApplicationAccepted";
    CbEvents["OnFriendApplicationAdded"] = "OnFriendApplicationAdded";
    CbEvents["OnFriendApplicationDeleted"] = "OnFriendApplicationDeleted";
    CbEvents["OnFriendApplicationRejected"] = "OnFriendApplicationRejected";
    CbEvents["OnFriendInfoChanged"] = "OnFriendInfoChanged";
    CbEvents["OnFriendAdded"] = "OnFriendAdded";
    CbEvents["OnFriendDeleted"] = "OnFriendDeleted";
    CbEvents["OnJoinedGroupAdded"] = "OnJoinedGroupAdded";
    CbEvents["OnJoinedGroupDeleted"] = "OnJoinedGroupDeleted";
    CbEvents["OnGroupDismissed"] = "OnGroupDismissed";
    CbEvents["OnGroupMemberAdded"] = "OnGroupMemberAdded";
    CbEvents["OnGroupMemberDeleted"] = "OnGroupMemberDeleted";
    CbEvents["OnGroupApplicationAdded"] = "OnGroupApplicationAdded";
    CbEvents["OnGroupApplicationDeleted"] = "OnGroupApplicationDeleted";
    CbEvents["OnGroupInfoChanged"] = "OnGroupInfoChanged";
    CbEvents["OnGroupMemberInfoChanged"] = "OnGroupMemberInfoChanged";
    CbEvents["OnGroupApplicationAccepted"] = "OnGroupApplicationAccepted";
    CbEvents["OnGroupApplicationRejected"] = "OnGroupApplicationRejected";
    CbEvents["UploadComplete"] = "UploadComplete";
    CbEvents["OnRecvCustomBusinessMessage"] = "OnRecvCustomBusinessMessage";
    CbEvents["OnUserStatusChanged"] = "OnUserStatusChanged";
    // rtc
    CbEvents["OnReceiveNewInvitation"] = "OnReceiveNewInvitation";
    CbEvents["OnInviteeAccepted"] = "OnInviteeAccepted";
    CbEvents["OnInviteeRejected"] = "OnInviteeRejected";
    CbEvents["OnInvitationCancelled"] = "OnInvitationCancelled";
    CbEvents["OnHangUp"] = "OnHangUp";
    CbEvents["OnInvitationTimeout"] = "OnInvitationTimeout";
    CbEvents["OnInviteeAcceptedByOtherDevice"] = "OnInviteeAcceptedByOtherDevice";
    CbEvents["OnInviteeRejectedByOtherDevice"] = "OnInviteeRejectedByOtherDevice";
    // meeting
    CbEvents["OnStreamChange"] = "OnStreamChange";
    CbEvents["OnRoomParticipantConnected"] = "OnRoomParticipantConnected";
    CbEvents["OnRoomParticipantDisconnected"] = "OnRoomParticipantDisconnected";
    CbEvents["OnReceiveCustomSignal"] = "OnReceiveCustomSignal";
})(CbEvents || (CbEvents = {}));
