import { MessageType } from "../utils/open_im_sdk_wasm/types/enum";

export const TipsType = [
  MessageType.REVOKEMESSAGE,
  MessageType.ADVANCEREVOKEMESSAGE,
  MessageType.FRIENDAPPLICATIONAPPROVED,
  MessageType.FRIENDAPPLICATIONREJECTED,
  MessageType.FRIENDAPPLICATIONADDED,
  MessageType.FRIENDADDED,
  MessageType.FRIENDDELETED,
  MessageType.FRIENDREMARKSET,
  MessageType.BLACKADDED,
  MessageType.BLACKDELETED,
  MessageType.SELFINFOUPDATED,
  MessageType.GROUPCREATED,
  MessageType.GROUPINFOUPDATED,
  MessageType.JOINGROUPAPPLICATIONADDED,
  MessageType.MEMBERQUIT,
  MessageType.GROUPAPPLICATIONACCEPTED,
  MessageType.GROUPAPPLICATIONREJECTED,
  MessageType.GROUPOWNERTRANSFERRED,
  MessageType.MEMBERKICKED,
  MessageType.MEMBERINVITED,
  MessageType.MEMBERENTER,
  MessageType.GROUPDISMISSED,
  MessageType.GROUPMEMBERMUTED,
  MessageType.GROUPMEMBERCANCELMUTED,
  MessageType.GROUPMUTED,
  MessageType.GROUPCANCELMUTED,
  MessageType.BURNMESSAGECHANGE,
];

export const nomalMessageTypes = [
  MessageType.TEXTMESSAGE,
  MessageType.ATTEXTMESSAGE,
  MessageType.CARDMESSAGE,
  MessageType.MERGERMESSAGE,
  MessageType.LOCATIONMESSAGE,
  MessageType.CUSTOMMESSAGE,
  MessageType.REVOKEMESSAGE,
  MessageType.ADVANCEREVOKEMESSAGE,
  MessageType.HASREADRECEIPTMESSAGE,
  MessageType.TYPINGMESSAGE,
  MessageType.QUOTEMESSAGE,
];

export const notOssMessageTypes = [MessageType.PICTUREMESSAGE, MessageType.VIDEOMESSAGE, MessageType.VOICEMESSAGE, MessageType.FILEMESSAGE];