import { t } from "i18next";

import { message } from "../AntdGlobalComp";

type FeedbackToastParams = {
  msg?: string | null;
  error?: unknown;
  duration?: number;
  onClose?: () => void;
};

interface FeedbackError extends Error {
  errMsg?: string;
  errDlt?: string;
}
export const feedbackToast = (config?: FeedbackToastParams) => {
  const { msg, error, duration, onClose } = config ?? {};
  let content = "";
  if (error) {
    content =
      (error as FeedbackError)?.message ??
      (error as FeedbackError)?.errDlt ??
      t("toast.accessFailed");
  }
  message.open({
    type: error ? "error" : "success",
    content: msg ?? content ?? t("toast.accessSuccess"),
    duration,
    onClose,
  });
  if (error) {
    console.error(msg, error);
  }
};

export const bytesToSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  const size = bytes / Math.pow(k, i);
  return `${size % 1 === 0 ? size : size.toFixed(2)} ${sizes[i]}`;
};

export const secondsToTime = (seconds: number) => {
  let minutes = 0; // min
  let hours = 0; // hour
  let days = 0; // day
  if (seconds > 60) {
    minutes = parseInt((seconds / 60) as unknown as string);
    seconds = parseInt((seconds % 60) as unknown as string);
    if (minutes > 60) {
      hours = parseInt((minutes / 60) as unknown as string);
      minutes = parseInt((minutes % 60) as unknown as string);
      if (hours > 24) {
        days = parseInt((hours / 24) as unknown as string);
        hours = parseInt((hours % 24) as unknown as string);
      }
    }
  }
  let result = "";
  if (seconds > 0) {
    result = t("date.second", { num: parseInt(seconds as unknown as string) });
  }
  if (minutes > 0) {
    result = t("date.minute", { num: parseInt(minutes as unknown as string) }) + result;
  }
  if (hours > 0) {
    result = t("date.hour", { num: parseInt(hours as unknown as string) }) + result;
  }
  if (days > 0) {
    result = t("date.day", { num: parseInt(days as unknown as string) }) + result;
  }
  return result;
};

export const secondsToMS = (duration: number) => {
  let minutes = Math.floor(duration / 60).toString();
  let seconds = (duration % 60).toString();
  minutes = minutes.length === 1 ? "0" + minutes : minutes;
  seconds = seconds.length === 1 ? "0" + seconds : seconds;
  return minutes + ":" + seconds;
};

export const filterEmptyValue = (obj: Record<string, unknown>) => {
  for (const key in obj) {
    if (obj[key] === "") {
      delete obj[key];
    }
  }
};

export const checkIsSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

export const base64toFile = (base64Str: string) => {
  var arr = base64Str.split(","),
    fileType = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `screenshot${Date.now()}.png`, {
    type: fileType,
  });
};

export const formatBr = (str: string) => str.replace(/\n/g, "<br>");

export const generateAvatar = (str: string, size = 40) => {
  str = !str ? t("placeholder.unknown") : str.split("")[0];
  let colors = ["#0072E3"];
  let cvs = document.createElement("canvas");
  cvs.setAttribute("width", size as unknown as string);
  cvs.setAttribute("height", size as unknown as string);
  let ctx = cvs.getContext("2d");
  ctx!.fillStyle = colors[Math.floor(Math.random() * colors.length)];
  ctx!.fillRect(0, 0, size, size);
  ctx!.fillStyle = "rgb(255,255,255)";
  ctx!.font = size * 0.4 + "px Arial";
  ctx!.textBaseline = "middle";
  ctx!.textAlign = "center";
  ctx!.fillText(str, size / 2, size / 2);
  return cvs.toDataURL("image/png", 1);
};

export async function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
