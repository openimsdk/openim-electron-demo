import { GroupItem } from "@openim/wasm-client-sdk/lib/types/entity";

import OIMAvatar from "@/components/OIMAvatar";

const GroupListItem = ({
  source,
  showGroupCard,
}: {
  source: GroupItem;
  showGroupCard: (group: GroupItem) => void;
}) => {
  return (
    <div
      className="flex flex-row rounded-md px-3.5 py-3 transition-colors hover:bg-[var(--primary-active)]"
      onClick={() => showGroupCard(source)}
    >
      <OIMAvatar src={source?.faceURL} isgroup />
      <div className="ml-3">
        <p className="text-base">{source.groupName}</p>
        <p className="text-xs text-[#8E9AB0FF]">{source.memberCount}</p>
      </div>
    </div>
  );
};

export default GroupListItem;
