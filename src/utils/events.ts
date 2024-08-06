import { ChooseModalState } from "@/pages/common/ChooseModal";
import { InviteData } from "@/pages/common/RtcCallModal/data";
import mitt from "mitt";
import { GroupItem, MessageItem } from "@openim/wasm-client-sdk/lib/types/entity";

type EmitterEvents = {
  OPEN_USER_CARD: OpenUserCardParams;
  OPEN_GROUP_CARD: GroupItem;
  OPEN_CHOOSE_MODAL: ChooseModalState;
  OPEN_VIDEO_PLAYER: string;
  OPEN_RTC_MODAL: InviteData;
  CHAT_LIST_SCROLL_TO_BOTTOM: boolean;

  // message store
  PUSH_NEW_MSG: MessageItem;
  UPDATE_ONE_MSG: MessageItem;
  DELETE_ONE_MSG: string;
  LOAD_HISTORY_MSGS: void;
  CLEAR_MSGS: void;
};

export type OpenUserCardParams = {
  userID?: string;
  isSelf?: boolean;
};

const emitter = mitt<EmitterEvents>();

export default emitter;
