import { MessageType, SessionType } from "@openim/wasm-client-sdk";

export const GroupSessionTypes = [SessionType.Group, SessionType.WorkingGroup];

export const GroupSystemMessageTypes = [
  MessageType.GroupCreated,
  MessageType.GroupInfoUpdated,
  MessageType.MemberQuit,
  MessageType.GroupOwnerTransferred,
  MessageType.MemberKicked,
  MessageType.MemberInvited,
  MessageType.MemberEnter,
  MessageType.GroupDismissed,
  MessageType.GroupMemberMuted,
  MessageType.GroupMuted,
  MessageType.GroupCancelMuted,
  MessageType.GroupMemberCancelMuted,
  MessageType.GroupNameUpdated,
];

export const SystemMessageTypes = [
  MessageType.RevokeMessage,
  MessageType.FriendAdded,
  MessageType.BurnMessageChange,
  ...GroupSystemMessageTypes,
];

export const CustomMessageType = {
  MassMsg: 903,
};

export const canSearchMessageTypes = [
  MessageType.TextMessage,
  MessageType.AtTextMessage,
  MessageType.FileMessage,
  MessageType.QuoteMessage,
  MessageType.PictureMessage,
  MessageType.VideoMessage,
  MessageType.CardMessage,
  MessageType.LocationMessage,
  MessageType.VoiceMessage,
  MessageType.CustomMessage,
];

export enum CustomType {
  CallingInvite = 200,
  CallingAccept = 201,
  CallingReject = 202,
  CallingCancel = 203,
  CallingHungup = 204,
}
