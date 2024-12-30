import { useRequest } from "ahooks";
import { Empty, Spin } from "antd";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { GroupedVirtuoso, GroupedVirtuosoHandle } from "react-virtuoso";

import { useContactStore } from "@/store";
import { formatContactsByWorker } from "@/utils/contactsFormat";
import { emit } from "@/utils/events";

import AlphabetIndex from "./AlphabetIndex";
import FriendListItem from "./FriendListItem";

export const MyFriends = () => {
  const { t } = useTranslation();
  const friendList = useContactStore((state) => state.friendList);
  const virtuoso = useRef<GroupedVirtuosoHandle>(null);
  const alphabetRef = useRef<{ updateCurrentLetter: (letter: string) => void }>(null);

  const { data: sectionData, cancel } = useRequest(
    () => formatContactsByWorker(friendList),
    {
      refreshDeps: [friendList],
    },
  );

  useEffect(() => {
    return () => {
      cancel();
    };
  }, []);

  const scrollToLetter = useCallback(
    (idx: number) => {
      const prevNum = sectionData?.groupCounts.slice(0, idx).reduce((a, b) => a + b, 0);
      console.log(prevNum);

      virtuoso.current?.scrollToIndex({
        index: prevNum ?? 0,
        // behavior: "smooth",
      });
    },
    [sectionData?.groupCounts],
  );

  const showUserCard = useCallback((userID: string) => {
    emit("OPEN_USER_CARD", {
      userID,
    });
  }, []);

  const determineCurrentGroup = (startIndex: number) => {
    if (!sectionData) return;

    let currentItemIndex = 0;

    for (
      let groupIndex = 0;
      groupIndex < sectionData.groupCounts.length;
      groupIndex++
    ) {
      const groupItemCount = sectionData.groupCounts[groupIndex];

      if (startIndex < currentItemIndex + groupItemCount) {
        alphabetRef.current?.updateCurrentLetter(sectionData.indexList[groupIndex]);
        break;
      }

      currentItemIndex += groupItemCount;
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <div className="m-5.5 text-base font-extrabold">{t("placeholder.myFriend")}</div>
      {!sectionData ? (
        <Spin />
      ) : !sectionData.groupCounts.length ? (
        <Empty className="mt-[30%]" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className="ml-4 mt-4 flex-1 overflow-auto pr-4">
          <AlphabetIndex
            ref={alphabetRef}
            indexList={sectionData.indexList}
            scrollToLetter={scrollToLetter}
          />

          <GroupedVirtuoso
            ref={virtuoso}
            groupCounts={sectionData.groupCounts}
            groupContent={(index) => (
              <div>
                <div className="bg-white px-3.5 pb-1 text-sm text-[#8E9AB0FF]">
                  {sectionData.indexList[index]}
                </div>
                <div className="mx-3.5 mb-3 h-px w-full bg-[#E8EAEFFF] bg-white" />
              </div>
            )}
            itemContent={(index) => {
              return (
                <FriendListItem
                  key={sectionData.totalList[index].userID}
                  friend={sectionData.totalList[index]}
                  showUserCard={showUserCard}
                />
              );
            }}
            rangeChanged={({ startIndex }) => determineCurrentGroup(startIndex)}
            className="no-scrollbar h-full overflow-x-hidden"
          />
        </div>
      )}
    </div>
  );
};
