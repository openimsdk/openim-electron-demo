import { MessageStatus, MessageType } from "@openim/wasm-client-sdk";
import { useDrag } from "ahooks";
import { Image, Spin } from "antd";
import { FC } from "react";

import { useVideoPlayer } from "@/pages/common/VideoPlayerModal";
import FileDownloadIcon from "@/svg/FileDownloadIcon";
import { secondsToMS } from "@/utils/common";

import { IMessageItemProps } from ".";

const min = (a: number, b: number) => (a > b ? b : a);

const MediaMessageRender: FC<IMessageItemProps> = ({ message }) => {
  const { showVideoPlayer } = useVideoPlayer();

  const isVideoMessage = message.contentType === MessageType.VideoMessage;
  const imageHeight = isVideoMessage
    ? message.videoElem!.snapshotHeight
    : message.pictureElem!.sourcePicture.height;
  const imageWidth = isVideoMessage
    ? message.videoElem!.snapshotWidth
    : message.pictureElem!.sourcePicture.width;
  const snapshotMaxHeight = isVideoMessage
    ? 320
    : message.pictureElem!.snapshotPicture.height;
  const minHeight = min(200, imageWidth) * (imageHeight / imageWidth) + 2;
  const adaptedHight = min(minHeight, snapshotMaxHeight) + 10;
  const adaptedWidth = min(imageWidth, 200) + 10;

  const isSucceed = message.status === MessageStatus.Succeed;

  const sourceUrl = isVideoMessage
    ? message.videoElem!.snapshotUrl
    : message.pictureElem!.snapshotPicture.url;

  const isSending = message.status === MessageStatus.Sending;
  const minStyle = { minHeight: `${adaptedHight}px`, minWidth: `${adaptedWidth}px` };

  return (
    <Spin spinning={isSending}>
      <div
        className="relative max-w-[200px]"
        style={minStyle}
        onClick={() => isVideoMessage && showVideoPlayer(message.videoElem!.videoUrl)}
      >
        <Image
          rootClassName="message-image cursor-pointer"
          className="max-w-[200px] rounded-md"
          src={sourceUrl}
          preview={!isVideoMessage}
          placeholder={
            <div style={minStyle} className="flex items-center justify-center">
              <Spin />
            </div>
          }
        />
        {isVideoMessage && (
          <div className="absolute bottom-3 right-4 text-white">
            {secondsToMS(message.videoElem!.duration)}
          </div>
        )}
        {isVideoMessage && isSucceed && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
            <FileDownloadIcon size={40} finished percent={0} />
          </div>
        )}
      </div>
    </Spin>
  );
};

export default MediaMessageRender;
