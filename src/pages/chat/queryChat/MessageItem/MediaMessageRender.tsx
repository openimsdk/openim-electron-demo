import { MessageStatus } from "@openim/wasm-client-sdk";
import { Image, Spin } from "antd";
import { FC } from "react";

import { IMessageItemProps } from ".";

const min = (a: number, b: number) => (a > b ? b : a);

const MediaMessageRender: FC<IMessageItemProps> = ({ message }) => {
  const pictureElem = message.pictureElem;
  if (!pictureElem) throw new Error("Picture message is missing pictureElem");

  const imageHeight = pictureElem.sourcePicture.height;
  const imageWidth = pictureElem.sourcePicture.width;
  const snapshotMaxHeight = pictureElem.snapshotPicture?.height ?? imageHeight;
  const minHeight = min(200, imageWidth) * (imageHeight / imageWidth) + 2;
  const adaptedHight = min(minHeight, snapshotMaxHeight) + 10;
  const adaptedWidth = min(imageWidth, 200) + 10;

  const sourceUrl = pictureElem.snapshotPicture?.url || pictureElem.sourcePicture.url;
  const isSending = message.status === MessageStatus.Sending;
  const minStyle = { minHeight: `${adaptedHight}px`, minWidth: `${adaptedWidth}px` };

  return (
    <Spin spinning={isSending}>
      <div className="relative max-w-[200px]" style={minStyle}>
        <Image
          rootClassName="message-image cursor-pointer"
          className="max-w-[200px] rounded-md"
          src={sourceUrl}
          preview
          placeholder={
            <div style={minStyle} className="flex items-center justify-center">
              <Spin />
            </div>
          }
        />
      </div>
    </Spin>
  );
};

export default MediaMessageRender;
