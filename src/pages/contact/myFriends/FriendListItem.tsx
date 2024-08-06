import { FriendUserItem } from "@openim/wasm-client-sdk/lib/types/entity";

import OIMAvatar from "@/components/OIMAvatar";

const FriendListItem = ({
  friend,
  showUserCard,
}: {
  friend: FriendUserItem;
  showUserCard: (userID: string) => void;
}) => {
  return (
    <div
      className="flex items-center rounded-md px-3.5 pb-3 pt-2.5 transition-colors hover:bg-[var(--primary-active)]"
      onClick={() => showUserCard(friend.userID)}
    >
      <OIMAvatar src={friend.faceURL} text={friend.remark || friend.nickname} />
      <div className="ml-3 truncate text-sm">{friend.remark || friend.nickname}</div>
    </div>
  );
};

export default FriendListItem;
