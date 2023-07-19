import { Badge } from "antd";
import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import group_notifications from "@/assets/images/contact/group_notifications.png";
import my_friends from "@/assets/images/contact/my_friends.png";
import my_groups from "@/assets/images/contact/my_groups.png";
import new_friends from "@/assets/images/contact/new_friends.png";
import FlexibleSider from "@/components/FlexibleSider";
import { useContactStore } from "@/store";

const Links = [
  {
    label: "新的好友",
    icon: new_friends,
    path: "/contact/newFriends",
  },
  {
    label: "群通知",
    icon: group_notifications,
    path: "/contact/groupNotifications",
  },
  {
    label: "我的好友",
    icon: my_friends,
    path: "/contact",
  },
  {
    label: "我的群组",
    icon: my_groups,
    path: "/contact/myGroups",
  },
];

const ContactSider = () => {
  const [selectIndex, setSelectIndex] = useState(2);
  const unHandleFriendApplicationCount = useContactStore(
    (state) => state.unHandleFriendApplicationCount,
  );
  const unHandleGroupApplicationCount = useContactStore(
    (state) => state.unHandleGroupApplicationCount,
  );
  const navigate = useNavigate();

  const getBadge = (index: number) => {
    if (index === 0) {
      return unHandleFriendApplicationCount;
    }
    if (index === 1) {
      return unHandleGroupApplicationCount;
    }
    return 0;
  };

  return (
    <FlexibleSider needHidden={true}>
      <div className="h-full bg-white">
        <div className="pb-3 pl-5.5 pt-5.5 text-base font-extrabold">通讯录</div>
        <ul>
          {Links.map((item, index) => {
            return (
              <li
                key={item.path}
                className={clsx(
                  "mx-2 flex cursor-pointer items-center rounded-md p-3 text-sm hover:bg-[#f3f8fe]",
                  {
                    "bg-[#f3f8fe]": index === selectIndex,
                  },
                )}
                onClick={() => {
                  setSelectIndex(index);
                  navigate(String(item.path));
                }}
              >
                <Badge size="small" count={getBadge(index)}>
                  <img
                    alt={item.label}
                    src={item.icon}
                    className="mr-3 h-10.5 w-10.5 rounded-md"
                  />
                </Badge>
                <div className="text-sm">{item.label}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </FlexibleSider>
  );
};
export default ContactSider;
