import clsx from "clsx";
import { useCallback } from "react";

import { useContactStore } from "@/store";
import { formatContacts } from "@/utils/common";
import emitter from "@/utils/events";

import AlphabetIndex from "./AlphabetIndex";
import FriendListItem from "./FriendListItem";

export const MyFriends = () => {
  const friendList = useContactStore((state) => state.friendList);

  const { dataList, indexList } = formatContacts(friendList);

  const showUserCard = useCallback((userID: string) => {
    emitter.emit("OPEN_USER_CARD", {
      userID,
    });
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="m-5.5 text-base font-extrabold">我的好友</div>
      <div className="ml-4 mt-4 flex-1 overflow-auto pr-4">
        <AlphabetIndex indexList={indexList} />
        <div
          id="alphabet-wrap"
          className="no-scrollbar h-full overflow-y-auto overflow-x-hidden"
        >
          {dataList.map((friends, index) => {
            return (
              <div key={indexList[index]}>
                <div
                  id={`letter${indexList[index]}`}
                  className={clsx("my-alphabet px-3.5 pb-1 text-sm text-[#8E9AB0FF]", {
                    "pt-4.5": Boolean(index),
                  })}
                >
                  {indexList[index]}
                </div>
                <div className="mx-3.5 mb-3 h-px w-full bg-[#E8EAEFFF] bg-white" />
                {friends.map((friend) => (
                  <FriendListItem
                    key={friend.userID}
                    friend={friend}
                    showUserCard={showUserCard}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
