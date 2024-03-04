import { ChooseModalState } from "@/pages/common/ChooseModal";
import { InviteData } from "@/pages/common/RtcCallModal/data";
import mitt from "mitt";
import { GroupItem } from "open-im-sdk-wasm/lib/types/entity";

type EmitterEvents = {
  OPEN_USER_CARD: OpenUserCardParams;
  OPEN_GROUP_CARD: GroupItem;
  OPEN_CHOOSE_MODAL: ChooseModalState;
  OPEN_VIDEO_PLAYER: string;
  OPEN_RTC_MODAL: InviteData;
  CHAT_LIST_SCROLL_TO_BOTTOM: boolean;
};

export type OpenUserCardParams = {
  userID?: string;
  groupID?: string;
  isSelf?: boolean;
  notAdd?: boolean;
};

const emitter = mitt<EmitterEvents>();

export default emitter;
