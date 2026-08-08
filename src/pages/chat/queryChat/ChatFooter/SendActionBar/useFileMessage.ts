import type { getSDK, MessageItem } from "@openim/wasm-client-sdk";
import { v4 as uuidV4 } from "uuid";

import { IMSDK } from "@/layout/MainContentWrap";

export interface FileWithPath extends File {
  path?: string;
}

type WasmFileMessageSdk = Pick<ReturnType<typeof getSDK>, "createImageMessageByFile">;

const supportsWasmFileMessage = (sdk: unknown): sdk is WasmFileMessageSdk =>
  typeof (sdk as Partial<WasmFileMessageSdk>)?.createImageMessageByFile === "function";

const assertMessage = (message: MessageItem | ""): MessageItem => {
  if (!message) {
    throw new Error("OpenIM SDK returned an empty image message");
  }
  return message;
};

export function useFileMessage() {
  const getImageMessage = async (file: FileWithPath) => {
    const { width, height } = await getPicInfo(file);
    const baseInfo = {
      uuid: uuidV4(),
      type: file.type,
      size: file.size,
      width,
      height,
      url: URL.createObjectURL(file),
    };

    if (window.electronAPI) {
      if (!file.path) {
        throw new Error("A local file path is required in Electron");
      }

      const imageMessage = assertMessage(
        (await IMSDK.createImageMessageFromFullPath(file.path)).data,
      );
      if (!imageMessage.pictureElem) {
        throw new Error("OpenIM SDK returned an image message without pictureElem");
      }
      imageMessage.pictureElem.sourcePicture.url = baseInfo.url;
      return imageMessage;
    }
    const options = {
      sourcePicture: baseInfo,
      bigPicture: baseInfo,
      snapshotPicture: baseInfo,
      sourcePath: "",
      file,
    };

    if (!supportsWasmFileMessage(IMSDK)) {
      throw new Error("The WASM image file API is unavailable");
    }
    return (await IMSDK.createImageMessageByFile(options)).data;
  };

  const getPicInfo = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve) => {
      const _URL = window.URL || window.webkitURL;
      const img = new Image();
      img.onload = function () {
        resolve(img);
      };
      img.src = _URL.createObjectURL(file);
    });

  return {
    getImageMessage,
  };
}
