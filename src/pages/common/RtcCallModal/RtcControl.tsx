import {
  TrackToggle,
  useLocalParticipant,
  useRoomContext,
} from "@livekit/components-react";
import { CbEvents, MessageType } from "@openim/wasm-client-sdk";
import {
  MessageItem,
  RtcInvite,
  WSEvent,
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
  invitation: RtcInvite;
  connectRtc: (data?: AuthData) => void;
  closeOverlay: () => void;
  sendCustomSignal: (recvID: string, customType: CustomType) => Promise<void>;
}
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

  const recvID = isRecv ? invitation.inviterUserID : invitation.inviteeUserIDList[0];
  const isVideoCall = invitation.mediaType === "video";

  useEffect(() => {
    const acceptHandler = async ({ roomID }: RtcInvite) => {
      if (invitation.roomID !== roomID) return;
      const { data } = await getRtcConnectData(
        roomID,
        useUserStore.getState().selfInfo.userID,
      );
      connectRtc(data);
    };
    const rejectHandler = ({ roomID }: RtcInvite) => {
      if (invitation.roomID !== roomID) return;
      closeOverlay();
    };
    const hangupHandler = ({ roomID }: RtcInvite) => {
      if (invitation.roomID !== roomID) return;
      room.disconnect();
      closeOverlay();
    };
    const cancelHandler = ({ roomID }: RtcInvite) => {
      if (invitation.roomID !== roomID) return;
      if (!isWaiting) return;
      closeOverlay();
    };
    const participantDisconnectedHandler = (remoteParticipant: RemoteParticipant) => {
      const identity = remoteParticipant.identity;
      if (
        identity === invitation.inviterUserID ||
        identity === invitation.inviteeUserIDList[0]
      ) {
        room.disconnect();
      }
    };

    const newMessageHandler = ({ data }: WSEvent<MessageItem[]>) => {
      data.map((message) => {
        if (message.contentType === MessageType.CustomMessage) {
          const customData = JSON.parse(message.customElem!.data) as {
            data: RtcInvite;
            customType: CustomType;
          };
          if (customData.customType === CustomType.CallingAccept) {
            acceptHandler(customData.data);
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

    IMSDK.on(CbEvents.OnRecvNewMessages, newMessageHandler);
    room.on(RoomEvent.ParticipantDisconnected, participantDisconnectedHandler);
    return () => {
      IMSDK.off(CbEvents.OnRecvNewMessages, newMessageHandler);
      room.off(RoomEvent.ParticipantDisconnected, participantDisconnectedHandler);
    };
  }, [room, invitation.roomID, isWaiting]);

  const hungup = () => {
    if (isWaiting) {
      const customType = isRecv ? CustomType.CallingReject : CustomType.CallingCancel;
      sendCustomSignal(recvID, customType);
      closeOverlay();
      return;
    }
    sendCustomSignal(recvID, CustomType.CallingHungup);
    room.disconnect();
  };

  const acceptInvitation = async () => {
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
          onClick={acceptInvitation}
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
