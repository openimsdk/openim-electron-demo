import { RightOutlined } from "@ant-design/icons";
import { SessionType } from "@openim/wasm-client-sdk";
import { FriendUserItem, GroupItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { Empty, Spin } from "antd";
import clsx from "clsx";
import { t } from "i18next";
import { useCallback } from "react";

import { useConversationToggle } from "@/hooks/useConversationToggle";

import { SearchData, TabKey } from ".";
import { ContactItem, ContactRender } from "./ContactPanel";

const ShowMoreAction = ({ onClick }: { onClick: () => void }) => (
  <div className="flex cursor-pointer items-center" onClick={onClick}>
    <span className="text-[var(--primary)]">{t("placeholder.viewMore")}</span>
    <RightOutlined className="text-[var(--primary)]" />
  </div>
);

const DashboardPanel = ({
  friends,
  groups,
  toggleTab,
  closeOverlay,
}: {
  friends: SearchData<FriendUserItem>;
  groups: SearchData<GroupItem>;
  toggleTab: (key: TabKey) => void;
  closeOverlay: () => void;
}) => {
  const { toSpecifiedConversation } = useConversationToggle();

  const contactJumpToConversation = useCallback((item: ContactItem) => {
    toSpecifiedConversation({
      sourceID: item.userID || item.groupID || "",
      sessionType: item.groupID ? SessionType.WorkingGroup : SessionType.Single,
      isChildWindow: true,
    });
    closeOverlay();
  }, []);

  const loading = friends.loading || groups.loading;
  const isEmpty = !(friends.data.length + groups.data.length);
  const initailGroupIdx = friends.data.slice(0, 3).length;

  return (
    <Spin wrapperClassName="h-full" spinning={loading}>
      <div className="h-full overflow-y-auto p-3">
        {isEmpty && <Empty className="mt-[25%]" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        {friends.data.length > 0 && (
          <div>
            <div className="mx-3 my-1 flex justify-between">
              <div>{t("placeholder.contacts")}</div>
              {friends.data.length > 3 && (
                <ShowMoreAction onClick={() => toggleTab("Friends")} />
              )}
            </div>
            {friends.data.slice(0, 3).map((friend, idx) => (
              <ContactRender
                key={friend.userID}
                id={`dashboard-item-${idx}`}
                item={friend}
                onClick={() => contactJumpToConversation(friend)}
              />
            ))}
          </div>
        )}

        {groups.data.length > 0 && (
          <div
            className={clsx("mt-2 border-[var(--gap-text)]", {
              "border-t": initailGroupIdx,
            })}
          >
            <div className="mx-3 mb-1 mt-3 flex justify-between">
              <div>{t("placeholder.myGroup")}</div>
              {groups.data.length > 3 && (
                <ShowMoreAction onClick={() => toggleTab("Groups")} />
              )}
            </div>
            {groups.data.slice(0, 3).map((group, idx) => (
              <ContactRender
                key={group.groupID}
                id={`dashboard-item-${initailGroupIdx + idx}`}
                item={group}
                onClick={() => contactJumpToConversation(group)}
              />
            ))}
          </div>
        )}
      </div>
    </Spin>
  );
};

export default DashboardPanel;
