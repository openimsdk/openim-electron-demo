import { CloseOutlined, RightOutlined } from "@ant-design/icons";
import { SessionType } from "@openim/wasm-client-sdk";
import {
  ConversationItem,
  FriendUserItem,
  GroupItem,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { Checkbox } from "antd";
import clsx from "clsx";
import { FC, memo } from "react";

import OIMAvatar from "@/components/OIMAvatar";

interface ICheckItemProps {
  data: CheckListItem;
  isChecked?: boolean;
  showCheck?: boolean;
  disabled?: boolean;
  itemClick?: (data: CheckListItem) => void;
  cancelClick?: (data: CheckListItem) => void;
}

export type CheckListItem = Partial<
  FriendUserItem & ConversationItem & GroupItem & { disabled?: boolean }
>;

const CheckItem: FC<ICheckItemProps> = (props) => {
  const { data, isChecked, showCheck, disabled, itemClick, cancelClick } = props;
  const showName = data.remark || data.nickname || data.groupName || data.showName;
  const isDisabled = disabled ?? data.disabled;
  return (
    <div
      className={clsx(
        "mx-2 flex items-center justify-between rounded-md px-3.5 py-2.5 hover:bg-[var(--primary-active)]",
        { "cursor-pointer": showCheck },
      )}
      onClick={() => !isDisabled && itemClick?.(data)}
    >
      <div className="flex items-center">
        {showCheck && (
          <Checkbox className="mr-3" checked={isChecked} disabled={isDisabled} />
        )}
        <OIMAvatar
          src={data.faceURL}
          text={showName}
          isgroup={
            Boolean(data.groupName) ||
            data.conversationType === SessionType.WorkingGroup
          }
        />
        <div className="ml-3 max-w-[120px] truncate">{showName}</div>
      </div>
      {showCheck ? (
        <RightOutlined
          className="cursor-pointer text-[var(--sub-text)]"
          rev={undefined}
        />
      ) : (
        <CloseOutlined
          className="cursor-pointer text-[var(--sub-text)]"
          rev={undefined}
          onClick={(e) => {
            e.stopPropagation();
            cancelClick?.(data);
          }}
        />
      )}
    </div>
  );
};

export default memo(CheckItem);
