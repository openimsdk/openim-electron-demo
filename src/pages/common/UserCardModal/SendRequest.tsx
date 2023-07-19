import { LeftOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import { Button, Input } from "antd";
import { t } from "i18next";
import { useState } from "react";

import OIMAvatar from "@/components/OIMAvatar";
import { IMSDK } from "@/layout/MainContentWrap";
import { feedbackToast } from "@/utils/common";

import { CardInfo } from ".";

const SendRequest = ({
  cardInfo,
  backToCard,
}: {
  cardInfo: CardInfo;
  backToCard: () => void;
}) => {
  const [reqMsg, setReqMsg] = useState("");
  const { runAsync, loading } = useRequest(IMSDK.addFriend, {
    manual: true,
  });

  const sendApplication = async () => {
    try {
      await runAsync({
        toUserID: cardInfo.userID!,
        reqMsg,
      });
      feedbackToast({ msg: "发送好友请求成功！" });
    } catch (error) {
      feedbackToast({ error, msg: t("toast.sendApplicationFailed") });
    }
    backToCard();
  };

  return (
    <div className="flex max-h-[520px] min-h-[484px] flex-col overflow-hidden px-5.5">
      <div className="w-full cursor-move">
        <div className="mb-8 mt-4.5 flex items-center">
          <LeftOutlined
            className="cursor-pointer text-[var(--sub-text)]"
            rev={undefined}
            onClick={backToCard}
          />
          <div className="ml-2 font-medium">好友验证</div>
        </div>
      </div>
      <div className="ignore-drag flex flex-1 flex-col">
        <div className="flex items-center">
          <OIMAvatar size={60} src={cardInfo?.faceURL} text={cardInfo?.nickname} />
          <div className="ml-3 flex-1 overflow-hidden">
            <div
              className="mb-3 flex-1 truncate text-base font-medium"
              title={cardInfo?.nickname}
            >
              {cardInfo?.nickname}
            </div>
            <div className="mr-3 text-xs text-[var(--sub-text)]">
              {cardInfo?.userID}
            </div>
          </div>
        </div>
        <div className="mt-7">
          <div className="text-xs text-[var(--sub-text)]">验证信息</div>
          <div className="mx-2 my-4">
            <Input.TextArea
              showCount
              value={reqMsg}
              maxLength={50}
              bordered={false}
              placeholder="请输入"
              style={{ padding: "8px 6px" }}
              autoSize={{ minRows: 6, maxRows: 6 }}
              onChange={(e) => setReqMsg(e.target.value)}
              className="bg-[var(--chat-bubble)] hover:bg-[var(--chat-bubble)]"
            />
          </div>
        </div>
        <div className="mx-2 mb-6 flex flex-1 items-end">
          <Button
            className="flex-1"
            type="primary"
            onClick={sendApplication}
            loading={loading}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendRequest;
