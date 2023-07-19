import OIMAvatar from "@/components/OIMAvatar";
import { FriendUserItem } from "@/utils/open-im-sdk-wasm/types/entity";

const FriendListItem = ({
  friend,
  showUserCard,
}: {
  friend: FriendUserItem;
  showUserCard: (userID: string) => void;
}) => {
  return (
    <div
      className="flex items-center rounded-md px-3.5 pb-3 pt-2.5 transition-colors hover:bg-[#f3f9ff]"
      onClick={() => showUserCard(friend.userID)}
    >
      <OIMAvatar src={friend.faceURL} text={friend.nickname} />
      <p className="ml-3 text-sm">{friend.nickname}</p>
    </div>
  );
};

export default FriendListItem;
