import { MessageItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { v4 as uuidV4 } from "uuid";

import { IMSDK } from "@/layout/MainContentWrap";
import { base64toFile } from "@/utils/common";

export interface FileWithPath extends File {
  path?: string;
}

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
    const options = {
      sourcePicture: baseInfo,
      bigPicture: baseInfo,
      snapshotPicture: baseInfo,
      sourcePath: "",
      file,
    };

    return (await IMSDK.createImageMessageByFile(options)).data;
  };

  const getVideoMessage = async (file: FileWithPath, snapShotFile: FileWithPath) => {
    const { width, height } = await getPicInfo(snapShotFile);
    const options = {
      videoFile: file,
      snapshotFile: snapShotFile,
      videoPath: "",
      duration: await getMediaDuration(URL.createObjectURL(file)),
      videoType: file.type,
      snapshotPath: "",
      videoUUID: uuidV4(),
      videoUrl: "",
      videoSize: file.size,
      snapshotUUID: uuidV4(),
      snapshotSize: snapShotFile.size,
      snapshotUrl: URL.createObjectURL(snapShotFile),
      snapshotWidth: width,
      snapshotHeight: height,
      snapShotType: snapShotFile.type,
    };
    return (await IMSDK.createVideoMessageByFile(options)).data;
  };

  const createImageOrVideoMessage = async (
    file: FileWithPath,
  ): Promise<MessageItem> => {
    const isImage = file.type.includes("image");
    if (isImage) {
      return await getImageMessage(file);
    }
    const snapShotFile = await getVideoSnshotFile(file);
    return await getVideoMessage(file, snapShotFile);
  };

  const getPicInfo = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const _URL = window.URL || window.webkitURL;
      const img = new Image();
      img.onload = function () {
        resolve(img);
      };
      img.src = _URL.createObjectURL(file);
    });

  const getVideoSnshotFile = (file: File): Promise<File> => {
    const url = URL.createObjectURL(file);
    return new Promise((reslove, reject) => {
      const video = document.createElement("VIDEO") as HTMLVideoElement;
      video.setAttribute("autoplay", "autoplay");
      video.setAttribute("muted", "muted");
      video.innerHTML = `<source src="${url}" type="audio/mp4">`;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      video.addEventListener("canplay", () => {
        const anw = document.createAttribute("width");
        //@ts-ignore
        anw.nodeValue = video.videoWidth;
        const anh = document.createAttribute("height");
        //@ts-ignore
        anh.nodeValue = video.videoHeight;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        //@ts-ignore
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const base64 = canvas.toDataURL("image/png");
        //@ts-ignore
        video.pause();
        const file = base64toFile(base64);
        reslove(file);
      });
    });
  };

  const getMediaDuration = (path: string): Promise<number> =>
    new Promise((resolve) => {
      const vel = new Audio(path);
      vel.onloadedmetadata = function () {
        resolve(Number(vel.duration.toFixed()));
      };
    });

  return {
    getImageMessage,
    getVideoMessage,
    getVideoSnshotFile,
    createImageOrVideoMessage,
  };
}
