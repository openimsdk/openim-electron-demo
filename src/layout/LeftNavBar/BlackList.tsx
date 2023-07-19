import { CloseOutlined } from "@ant-design/icons";
import { Button, Empty, Modal } from "antd";
import { forwardRef, ForwardRefRenderFunction, memo, useState } from "react";

import OIMAvatar from "@/components/OIMAvatar";
import { useContactStore } from "@/store/contact";
import { feedbackToast } from "@/utils/common";
import { BlackUserItem } from "@/utils/open-im-sdk-wasm/types/entity";

import { OverlayVisibleHandle, useOverlayVisible } from "../../hooks/useOverlayVisible";
import { IMSDK } from "../MainContentWrap";

const BlackList: ForwardRefRenderFunction<OverlayVisibleHandle, unknown> = (_, ref) => {
  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  return (
    <Modal
      title={null}
      footer={null}
      closable={false}
      open={isOverlayOpen}
      onCancel={closeOverlay}
      centered
      destroyOnClose
      maskStyle={{
        opacity: 0,
        transition: "none",
      }}
      width={420}
      className="no-padding-modal"
      maskTransitionName=""
    >
      <BlackListContent closeOverlay={closeOverlay} />
    </Modal>
  );
};

export default memo(forwardRef(BlackList));

const BlackItem = ({
  black,
  removeBlack,
}: {
  black: BlackUserItem;
  removeBlack: (userID: string) => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);

  const tryRemove = async () => {
    setLoading(true);
    await removeBlack(black.userID);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-between px-5 py-2.5">
      <div className="flex items-center">
        <OIMAvatar src={black.faceURL} text={black.nickname} />
        <div className="ml-3">{black.nickname}</div>
      </div>
      <Button type="primary" ghost loading={loading} onClick={tryRemove}>
        移除
      </Button>
    </div>
  );
};

export const BlackListContent = ({ closeOverlay }: { closeOverlay?: () => void }) => {
  const blackList = useContactStore((state) => state.blackList);

  const removeBlack = async (userID: string) => {
    try {
      await IMSDK.removeBlack(userID);
    } catch (error) {
      feedbackToast({ error });
    }
  };

  return (
    <div className="flex h-[468px] flex-col bg-[var(--chat-bubble)]">
      <div className="app-drag flex items-center justify-between p-5">
        <span className="text-base font-medium">通讯录黑名单</span>
        <CloseOutlined
          className="app-no-drag cursor-pointer text-[#8e9aaf]"
          rev={undefined}
          onClick={closeOverlay}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {blackList.length > 0 ? (
          blackList.map((black) => (
            <BlackItem black={black} key={black.userID} removeBlack={removeBlack} />
          ))
        ) : (
          <Empty className="flex h-full flex-col items-center justify-center" />
        )}
      </div>
    </div>
  );
};
