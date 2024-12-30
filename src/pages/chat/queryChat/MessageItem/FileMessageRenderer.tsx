import { MessageStatus } from "@openim/wasm-client-sdk";
import { Spin } from "antd";
import { FC } from "react";

import file_icon from "@/assets/images/messageItem/file_icon.png";
import FileDownloadIcon from "@/svg/FileDownloadIcon";
import { bytesToSize, downloadFile } from "@/utils/common";

import { IMessageItemProps } from ".";

const FileMessageRenderer: FC<IMessageItemProps> = ({ message }) => {
  const { fileElem } = message;

  const isSending = message.status === MessageStatus.Sending;

  return (
    <Spin spinning={isSending}>
      <div
        onClick={() => downloadFile(fileElem?.sourceUrl ?? "")}
        className="flex w-60 cursor-pointer items-center justify-between rounded-md border border-[var(--gap-text)]  p-3"
      >
        <div className="mr-2 flex h-full flex-1 flex-col justify-between overflow-hidden">
          <div data-drag="app-drag" className="line-clamp-2 break-all">
            {fileElem!.fileName}
          </div>
          <div data-drag="app-drag" className="text-xs text-[var(--sub-text)]">
            {bytesToSize(fileElem!.fileSize)}
          </div>
        </div>
        <div className="relative min-w-[38px]">
          <img width={38} src={file_icon} alt="file" data-drag="app-drag" />
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-md bg-[rgba(0,0,0,.4)]">
            <FileDownloadIcon percent={0} />
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default FileMessageRenderer;
