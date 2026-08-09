import {
  TrackToggle,
  useLocalParticipant,
  useRoomContext,
} from "@livekit/components-react";
import { MessageType, SdkEvent } from "@openim/wasm-client-sdk";
import {
  MessageItem,
  SdkEventEnvelope,
  SignalingInvitation,
} from "@openim/wasm-client-sdk/lib/types/entity";
import clsx from "clsx";
import { t } from "i18next";
import { RemoteParticipant, RoomEvent, Track } from "livekit-client";
import { useEffect, useRef } from "react";

import { getRtcConnectData } from "@/api/imApi";
import rtc_accept from "@/assets/images/rtc/rtc_accept.png";
import rtc_camera from "@/assets/images/rtc/rtc_camera.png";
import rtc_camera_off from "@/assets/images/rtc/rtc_camera_off.png";
import rtc_hungup from "@/assets/images/rtc/rtc_hungup.png";
import rtc_mic from "@/assets/images/rtc/rtc_mic.png";
import rtc_mic_off from "@/assets/images/rtc/rtc_mic_off.png";
import { CustomType } from "@/constants";
import { IMSDK } from "@/layout/MainContentWrap";
import { useUserStore } from "@/store";
import { feedbackToast } from "@/utils/common";

import { CounterHandle, ForwardCounter } from "./Counter";
import { AuthData } from "./data";

interface IRtcControlProps {
  isWaiting: boolean;
  isRecv: boolean;
  isConnected: boolean;
  invitation: SignalingInvitation;
  connectRtc: (data?: AuthData) => void;
  closeOverlay: () => void;
  sendCustomSignal: (recvID: string, customType: CustomType) => Promise<void>;
}

const isRtcSignal = (
  value: unknown,
): value is { data: SignalingInvitation; customType: CustomType } => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { data?: unknown; customType?: unknown };
  return Boolean(candidate.data) && typeof candidate.customType === "number";
};
export const RtcControl = ({
  isWaiting,
  isRecv,
  isConnected,
  invitation,
  connectRtc,
  closeOverlay,
  sendCustomSignal,
}: IRtcControlProps) => {
  const room = useRoomContext();
  const localParticipantState = useLocalParticipant();
  const counterRef = useRef<CounterHandle>(null);

  const inviterUserID = invitation.inviterUserID;
  const inviteeUserID = invitation.inviteeUserIDList[0];
  const recvID = isRecv ? inviterUserID : inviteeUserID;
  const isVideoCall = invitation.mediaType === "video";

  useEffect(() => {
    const acceptHandler = async ({ roomID }: SignalingInvitation) => {
      if (invitation.roomID !== roomID) return;
      const { data } = await getRtcConnectData(
        roomID,
        useUserStore.getState().selfInfo.userID,
      );
      connectRtc(data);
    };
    const rejectHandler = ({ roomID }: SignalingInvitation) => {
      if (invitation.roomID !== roomID) return;
      closeOverlay();
    };
    const hangupHandler = ({ roomID }: SignalingInvitation) => {
      if (invitation.roomID !== roomID) return;
      room.disconnect();
      closeOverlay();
    };
    const cancelHandler = ({ roomID }: SignalingInvitation) => {
      if (invitation.roomID !== roomID) return;
      if (!isWaiting) return;
      closeOverlay();
    };
    const participantDisconnectedHandler = (remoteParticipant: RemoteParticipant) => {
      const identity = remoteParticipant.identity;
      if (identity === inviterUserID || identity === inviteeUserID) {
        room.disconnect();
      }
    };

    const newMessageHandler = ({ data }: SdkEventEnvelope<MessageItem[]>) => {
      data.forEach((message) => {
        if (
          message.contentType === MessageType.CustomMessage &&
          message.customElem?.data
        ) {
          const customData = JSON.parse(message.customElem.data) as unknown;
          if (!isRtcSignal(customData)) return;
          if (customData.customType === CustomType.CallingAccept) {
            void acceptHandler(customData.data);
          }
          if (customData.customType === CustomType.CallingReject) {
            rejectHandler(customData.data);
          }
          if (customData.customType === CustomType.CallingCancel) {
            cancelHandler(customData.data);
          }
          if (customData.customType === CustomType.CallingHungup) {
            hangupHandler(customData.data);
          }
        }
      });
    };

    IMSDK.on(SdkEvent.OnRecvNewMessages, newMessageHandler);
    room.on(RoomEvent.ParticipantDisconnected, participantDisconnectedHandler);
    return () => {
      IMSDK.off(SdkEvent.OnRecvNewMessages, newMessageHandler);
      room.off(RoomEvent.ParticipantDisconnected, participantDisconnectedHandler);
    };
  }, [
    closeOverlay,
    connectRtc,
    invitation.roomID,
    inviteeUserID,
    inviterUserID,
    isWaiting,
    room,
  ]);

  const hungup = () => {
    if (!recvID) return;
    if (isWaiting) {
      const customType = isRecv ? CustomType.CallingReject : CustomType.CallingCancel;
      void sendCustomSignal(recvID, customType);
      closeOverlay();
      return;
    }
    void sendCustomSignal(recvID, CustomType.CallingHungup);
    room.disconnect();
  };

  const acceptInvitation = async () => {
    if (!recvID) return;
    try {
      await sendCustomSignal(recvID, CustomType.CallingAccept);
      const { data } = await getRtcConnectData(
        invitation.roomID,
        useUserStore.getState().selfInfo.userID,
      );
      connectRtc(data);
    } catch (error) {
      feedbackToast({ msg: t("toast.byInviteUserFailed"), error });
      closeOverlay();
    }
  };

  return (
    <div className="ignore-drag absolute bottom-[6%] z-10 flex justify-center">
      {!isWaiting && (
        <ForwardCounter
          ref={counterRef}
          className={clsx("absolute -top-8")}
          isConnected={isConnected}
        />
      )}
      {!isWaiting && (
        <TrackToggle
          className="flex cursor-pointer flex-col items-center !justify-start !gap-0 !p-0"
          source={Track.Source.Microphone}
          showIcon={false}
        >
          <img
            width={48}
            src={localParticipantState.isMicrophoneEnabled ? rtc_mic : rtc_mic_off}
            alt=""
          />
          <span className="mt-2 text-xs text-white">{t("placeholder.microphone")}</span>
        </TrackToggle>
      )}
      <div
        className={clsx("ml-12 flex cursor-pointer flex-col items-center", {
          "mr-12": isVideoCall,
          "!mx-0": !isRecv && isWaiting,
        })}
        onClick={hungup}
      >
        <img width={48} src={rtc_hungup} alt="" />
        <span
          className={clsx("mt-2 text-xs text-white", {
            "!text-[var(--sub-text)]": isWaiting,
          })}
        >
          {isWaiting ? t("cancel") : t("hangUp")}
        </span>
      </div>
      {isRecv && isWaiting && (
        <div
          className="mx-12 flex cursor-pointer flex-col items-center"
          onClick={() => void acceptInvitation()}
        >
          <img width={48} src={rtc_accept} alt="" />
          <span
            className={clsx("mt-2 text-xs text-white", {
              "!text-[var(--sub-text)]": isWaiting,
            })}
          >
            {t("answer")}
          </span>
        </div>
      )}
      {!isWaiting && isVideoCall && (
        <TrackToggle
          className="flex cursor-pointer flex-col items-center justify-start !gap-0 !p-0"
          source={Track.Source.Camera}
          showIcon={false}
        >
          <img
            width={48}
            src={localParticipantState.isCameraEnabled ? rtc_camera : rtc_camera_off}
            alt=""
          />
          <span className="mt-2 text-xs text-white">{t("placeholder.camera")}</span>
        </TrackToggle>
      )}
    </div>
  );
};
