import "@livekit/components-styles";

import { LiveKitRoom } from "@livekit/components-react";
import { t } from "i18next";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import DraggableModalWrap from "@/components/DraggableModalWrap";
import { CustomType } from "@/constants";
import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import { IMSDK } from "@/layout/MainContentWrap";
import { useUserStore } from "@/store";
import { feedbackToast } from "@/utils/common";

import { AuthData, InviteData } from "./data";
import { RtcLayout } from "./RtcLayout";

interface IRtcCallModalProps {
  inviteData: InviteData;
}

const RtcCallModal: ForwardRefRenderFunction<
  OverlayVisibleHandle,
  IRtcCallModalProps
> = ({ inviteData }, ref) => {
  const { invitation } = inviteData;
  const [connect, setConnect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [authData, setAuthData] = useState<AuthData>({
    serverUrl: "",
    token: "",
  });
  const selfID = useUserStore((state) => state.selfInfo.userID);
  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const isRecv = selfID !== invitation?.inviterUserID;

  const clearTimer = useCallback(() => clearTimeout(timer.current), []);

  const closeOverlayAndClearTimer = useCallback(() => {
    clearTimer();
    closeOverlay();
  }, [clearTimer, closeOverlay]);

  const sendCustomSignal = useCallback(
    async (recvID: string, customType: CustomType) => {
      const data = {
        customType,
        data: {
          ...invitation,
        },
      };
      const { data: message } = await IMSDK.createCustomMessage({
        data: JSON.stringify(data),
        extension: "",
        description: "",
      });
      await IMSDK.sendMessage({
        recvID,
        message,
        groupID: "",
        isOnlineOnly: true,
      });
    },
    [invitation],
  );

  const checkTimeout = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => {
      clearTimer();
      const recvID = invitation?.inviteeUserIDList[0];
      if (!recvID) return;
      void sendCustomSignal(recvID, CustomType.CallingCancel);
      closeOverlay();
    }, (invitation?.timeout ?? 30) * 1000);
  }, [clearTimer, closeOverlay, invitation, sendCustomSignal]);

  const tryInvite = useCallback(async () => {
    const recvID = invitation?.inviteeUserIDList[0];
    if (!isRecv && recvID) {
      try {
        await sendCustomSignal(recvID, CustomType.CallingInvite);
        checkTimeout();
      } catch (error) {
        feedbackToast({ msg: t("toast.inviteUserFailed"), error });
        closeOverlay();
      }
    }
  }, [
    checkTimeout,
    closeOverlay,
    invitation?.inviteeUserIDList,
    isRecv,
    sendCustomSignal,
  ]);

  useEffect(() => {
    if (!isOverlayOpen) return;
    void tryInvite();
  }, [isOverlayOpen, tryInvite]);

  const connectRtc = useCallback(
    (data?: AuthData) => {
      if (data) {
        setAuthData(data);
      }
      clearTimer();
      setTimeout(() => setConnect(true));
    },
    [clearTimer],
  );

  return (
    <DraggableModalWrap
      title={null}
      footer={null}
      open={isOverlayOpen}
      closable={false}
      maskClosable={false}
      keyboard={false}
      mask={false}
      centered
      width="auto"
      onCancel={closeOverlayAndClearTimer}
      destroyOnClose
      ignoreClasses=".ignore-drag, .no-padding-modal, .cursor-pointer"
      className="no-padding-modal rtc-single-modal"
      wrapClassName="pointer-events-none"
    >
      <div>
        {isOverlayOpen && (
          <LiveKitRoom
            serverUrl={authData.serverUrl}
            token={authData.token}
            video={invitation?.mediaType === "video"}
            audio={true}
            connect={connect}
            options={{
              publishDefaults: {
                videoCodec: "vp9",
                backupCodec: { codec: "vp8" },
              },
            }}
            onConnected={() => setIsConnected(true)}
            onDisconnected={() => {
              closeOverlayAndClearTimer();
              setIsConnected(false);
              setConnect(false);
            }}
          >
            <RtcLayout
              connect={connect}
              isConnected={isConnected}
              isRecv={isRecv}
              inviteData={inviteData}
              sendCustomSignal={sendCustomSignal}
              connectRtc={connectRtc}
              closeOverlay={closeOverlayAndClearTimer}
            />
          </LiveKitRoom>
        )}
      </div>
    </DraggableModalWrap>
  );
};

export default forwardRef(RtcCallModal);
