import { t } from "i18next";

import PinYin from "./pinyin";
import { message } from "../AntdGlobalComp";
import { FriendUserItem } from "open-im-sdk-wasm/lib/types/entity";

type FeedbackToastParams = {
  msg?: string | null;
  error?: unknown;
  duration?: number;
  onClose?: () => void;
};

export const feedbackToast = (config?: FeedbackToastParams) => {
  const { msg, error, duration, onClose } = config ?? {};
  let content = "";
  if (error) {
    content = (error as Error)?.message ?? t("toast.accessFailed");
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

  return `${(bytes / Math.pow(k, i)).toPrecision(3)} ${sizes[i]}`;
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

export const formatContacts = (data: FriendUserItem[], key = "nickname") => {
  const ucfirst = (l1: string) => {
    if (l1.length > 0) {
      const first = l1.substr(0, 1).toUpperCase();
      const spare = l1.substr(1, l1.length);
      return first + spare;
    }
  };

  const arraySearch = (l1: string) => {
    for (const name in PinYin) {
      // @ts-ignore
      if ((PinYin[name] as string).indexOf(l1) !== -1) {
        return ucfirst(name);
        break;
      }
    }
    return false;
  };

  const codefans = (l1: string) => {
    l1 = l1 ?? "unkown";
    const l2 = l1.length;
    let I1 = "";
    const reg = new RegExp("[a-zA-Z0-9- ]");
    for (let i = 0; i < l2; i++) {
      const val = l1.substr(i, 1);
      const name = arraySearch(val);
      if (reg.test(val)) {
        I1 += val;
      } else if (name !== false) {
        I1 += name;
      }
    }
    I1 = I1.replace(/ /g, "-");
    while (I1.indexOf("--") > 0) {
      I1 = I1.replace("--", "-");
    }
    return I1;
  };

  const arr = [];

  for (i = 0; i < data.length; i++) {
    // @ts-ignore
    const firstName = (data[i].initial = codefans(data[i][key]).substr(0, 1));
    arr.push(firstName.toUpperCase());
  }

  const arrlist = [];
  for (i = 0; i < arr.length; i++) {
    if (arrlist.indexOf(arr[i]) === -1) {
      arrlist.push(arr[i]);
    }
  }

  // @ts-ignore
  const dataSort = [] as any[];
  for (i = 0; i < arrlist.length; i++) {
    dataSort[i] = {
      initial: arrlist[i],
    };
    dataSort[i].data = [];
    for (j = 0; j < data.length; j++) {
      // @ts-ignore
      if (data[j].initial.toUpperCase() === dataSort[i].initial) {
        dataSort[i].data.push(data[j]);
      }
    }
  }
  for (var i = 0; i < dataSort.length - 1; i++) {
    for (var j = 1; j < dataSort.length - i; j++) {
      if (dataSort[j - 1].initial > dataSort[j].initial) {
        const a = dataSort[j];
        dataSort[j] = dataSort[j - 1];
        dataSort[j - 1] = a;
      }
    }
  }
  const NomalInitial = "QWERTYUIOPLKJHGFDSAZXCVBNM".split("");
  const special = {
    initial: "#",
    data: [] as any[],
  };
  const newFilterData = dataSort.filter((d) => {
    if (!NomalInitial.includes(d.initial)) {
      special.data = [...special.data, ...d.data];
    } else {
      return d;
    }
  });
  if (special.data.length > 0) {
    newFilterData.push(special);
  }
  const indexList = newFilterData.map((item) => item.initial as string);
  const dataList = newFilterData.map((item) => item.data as FriendUserItem[]);
  return {
    indexList,
    dataList,
  };
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

type DownloadFileParams = {
  fileUrl: string;
  filename: string;
  onProgress?: (downloadProgress: number) => void;
};
export const downloadFile = ({ filename, fileUrl, onProgress }: DownloadFileParams) => {
  const controller = new AbortController();
  const { signal } = controller;

  let isPaused = false;
  let isCancelled = false;

  fetch(fileUrl, { signal })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const totalLength = Number(response.headers.get("content-length") as string);
      let downloadedLength = 0;

      const reader = response.clone().body?.getReader();

      const read = () => {
        if (!reader) return;
        reader
          .read()
          .then(({ done, value }) => {
            if (isCancelled) {
              console.log("Download cancelled.");
              return;
            }

            if (done) {
              response.blob().then((blob) => {
                const link = document.createElement("a");
                link.href = `${window.URL.createObjectURL(blob)}`;
                link.download = filename;
                link.click();
              });
              return;
            }

            if (isPaused) {
              setTimeout(read, 1000);
              return;
            }

            downloadedLength += value.length;
            const percentComplete = (downloadedLength / totalLength) * 100;
            onProgress?.(Number(percentComplete.toFixed()));
            read();
          })
          .catch((error) => {
            console.error("Error while reading stream:", error);
          });
      };

      read();
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);
    });

  return {
    pause: () => {
      isPaused = true;
    },
    resume: () => {
      isPaused = false;
    },
    cancel: () => {
      isCancelled = true;
      controller.abort();
    },
  };
};

export const getFileData = (data: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(data);
  });
};

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

export const blobToDataURL = (blob: File, cb: (base64: string) => void) => {
  const reader = new FileReader();
  reader.onload = function (evt) {
    const base64 = evt.target?.result;
    cb(base64 as string);
  };
  reader.readAsDataURL(blob);
};

export const formatBr = (str: string) => str.replace(/\n/g, "<br>");

const longestCommonSubsequence = (str1: string, str2: string) => {
  const dp = Array.from({ length: str1.length + 1 }, () =>
    Array(str2.length + 1).fill(0),
  );

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let lcs = "";
  let i = str1.length;
  let j = str2.length;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcs = str1[i - 1] + lcs;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs;
};

export const getExtraStr = (str1: string, str2: string) => {
  const lcs = longestCommonSubsequence(str1, str2);
  let extraPart = "";
  let lcsIndex = 0;

  for (let i = 0; i < str2.length; i++) {
    if (lcsIndex < lcs.length && str2[i] === lcs[lcsIndex]) {
      lcsIndex++;
    } else {
      extraPart += str2[i];
    }
  }

  return extraPart.slice(1);
};

export const getFileType = (name: string) => {
  const idx = name.lastIndexOf(".");
  return name.slice(idx + 1);
};
