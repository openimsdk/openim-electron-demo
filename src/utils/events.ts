import { ChooseModalState } from "@/pages/common/ChooseModal";
import { CheckListItem } from "@/pages/common/ChooseModal/ChooseBox/CheckItem";
import mitt from "mitt";
import {
  GroupItem,
  GroupMemberItem,
  MessageItem,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { InviteData } from "@/pages/common/RtcCallModal/data";

type EmitterEvents = {
  OPEN_USER_CARD: OpenUserCardParams;
  OPEN_GROUP_CARD: GroupItem;
  OPEN_CHOOSE_MODAL: ChooseModalState;
  CHAT_LIST_SCROLL_TO_BOTTOM: void;
  OPEN_RTC_MODAL: InviteData;
  // message store
  PUSH_NEW_MSG: MessageItem;
  UPDATE_ONE_MSG: MessageItem;
  UPDATE_MSG_NICK_AND_FACEURL: UpdateMessaggeBaseInfoParams;
  DELETE_ONE_MSG: string;
  LOAD_HISTORY_MSGS: void;
  GET_MSG_LIST: (messages: MessageItem[]) => void;
  CLEAR_MSGS: void;
  CLEAR_MSG_STATE: keyof MessageItem;

  SELECT_USER: SelectUserParams;
  CLOSE_SEARCH_MODAL: void;
  TRIGGER_GROUP_AT: GroupMemberItem;
};

export type SelectUserParams = {
  notConversation: boolean;
  choosedList: CheckListItem[];
};

export type OpenUserCardParams = {
  userID?: string;
  groupID?: string;
  isSelf?: boolean;
  notAdd?: boolean;
};

export type UpdateMessaggeBaseInfoParams = {
  sendID: string;
  senderNickname: string;
  senderFaceUrl: string;
};

const emitter = mitt<EmitterEvents>();

export const emit = emitter.emit;

export default emitter;
