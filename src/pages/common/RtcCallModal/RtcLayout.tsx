import {
  RoomAudioRenderer,
  TrackLoop,
  TrackRefContext,
  useConnectionState,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { PublicUserItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { Spin } from "antd";
import clsx from "clsx";
import {
  ConnectionState,
  LocalParticipant,
  Participant,
  ParticipantEvent,
  Track,
} from "livekit-client";
import { useEffect, useState } from "react";

import OIMAvatar from "@/components/OIMAvatar";
import { CustomType } from "@/constants";

import { AuthData, InviteData } from "./data";
import { RtcControl } from "./RtcControl";

const localVideoClasses =
  "absolute right-3 top-3 !w-[100px] !h-[150px] rounded-md z-10";
const remoteVideoClasses = "absolute top-0 z-0";

interface IRtcLayoutProps {
  connect: boolean;
  isConnected: boolean;
  isRecv: boolean;
  inviteData?: InviteData;
  closeOverlay: () => void;
  sendCustomSignal: (recvID: string, customType: CustomType) => Promise<void>;
  connectRtc: (data?: AuthData) => void;
}
export const RtcLayout = ({
  connect,
  isConnected,
  isRecv,
  inviteData,
  connectRtc,
  sendCustomSignal,
  closeOverlay,
}: IRtcLayoutProps) => {
  const isVideoCall = inviteData?.invitation?.mediaType === "video";
  const tracks = useTracks([Track.Source.Camera]);
  const remoteParticipant = tracks.find((track) => !isLocal(track.participant));
  const isWaiting = !connect && !isConnected;
  const [isRemoteVideoMuted, setIsRemoteVideoMuted] = useState(false);

  const connectState = useConnectionState();

  useEffect(() => {
    if (!remoteParticipant?.participant.identity) return;
    const trackMuteUpdate = () => {
      setIsRemoteVideoMuted(!remoteParticipant?.participant.isCameraEnabled);
    };
    remoteParticipant?.participant.on(ParticipantEvent.TrackMuted, trackMuteUpdate);
    remoteParticipant?.participant.on(ParticipantEvent.TrackUnmuted, trackMuteUpdate);
    trackMuteUpdate();
  }, [remoteParticipant?.participant.identity]);

  const renderContent = () => {
    if (!isWaiting && isVideoCall && !isRemoteVideoMuted) return null;

    return (
      <SingleProfile
        isWaiting={isWaiting}
        userInfo={inviteData?.participant?.userInfo}
      />
    );
  };

  return (
    <Spin spinning={connectState === ConnectionState.Connecting}>
      <div
        className="relative"
        style={{
          height: `340px`,
          width: `480px`,
        }}
      >
        <div
          className={clsx(
            "flex h-full flex-col items-center justify-between bg-[#262729]",
            { "!bg-[#F2F8FF]": isWaiting },
          )}
        >
          {renderContent()}
          <RtcControl
            isWaiting={isWaiting}
            isRecv={isRecv}
            isConnected={isConnected}
            // @ts-ignore
            invitation={inviteData?.invitation}
            closeOverlay={closeOverlay}
            connectRtc={connectRtc}
            sendCustomSignal={sendCustomSignal}
          />
        </div>
        {isConnected && (
          <TrackLoop tracks={tracks}>
            <TrackRefContext.Consumer>
              {(track) =>
                track && (
                  <VideoTrack
                    {...track}
                    className={
                      isLocal(track.participant)
                        ? localVideoClasses
                        : `${remoteVideoClasses} ${isRemoteVideoMuted ? "hidden" : ""}`
                    }
                  />
                )
              }
            </TrackRefContext.Consumer>
          </TrackLoop>
        )}
      </div>
      <RoomAudioRenderer />
    </Spin>
  );
};

interface ISingleProfileProps {
  isWaiting: boolean;
  userInfo?: PublicUserItem;
}
const SingleProfile = ({ isWaiting, userInfo }: ISingleProfileProps) => {
  return (
    <div className="absolute top-[10%] flex flex-col items-center">
      <OIMAvatar size={48} src={userInfo?.faceURL} text={userInfo?.nickname} />
      <div
        className={clsx("mt-3 max-w-[120px] truncate text-white", {
          "!text-[var(--base-black)]": isWaiting,
        })}
      >
        {userInfo?.nickname}
      </div>
    </div>
  );
};

const isLocal = (p: Participant) => {
  return p instanceof LocalParticipant;
};
