import { Skeleton } from "antd";

const ConversationSkeleton = () => {
  return (
    <div className="my-1 flex p-3">
      <Skeleton avatar={{ shape: "square" }} active title paragraph={{ rows: 1 }} />
    </div>
  );
};

export default ConversationSkeleton;
