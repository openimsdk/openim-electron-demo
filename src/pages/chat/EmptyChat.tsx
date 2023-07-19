import { Button, Layout } from "antd";

import empty_chat_bg from "@/assets/images/empty_chat_bg.png";
import emitter from "@/utils/events";

export const EmptyChat = () => {
  const createNow = () => {
    emitter.emit("OPEN_CHOOSE_MODAL", {
      type: "CRATE_GROUP",
    });
  };

  return (
    <Layout className="no-mobile flex items-center justify-center bg-white">
      <div>
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-3 text-xl font-medium">创建群组</div>
          <div className="text-[var(--sub-text)]">创建群组，立即开启在线化办公</div>
        </div>
        <img src={empty_chat_bg} alt="" width={320} />

        <div className="mt-28 flex justify-center">
          <Button className="px-8" type="primary" onClick={createNow}>
            立即创建
          </Button>
        </div>
      </div>
    </Layout>
  );
};
