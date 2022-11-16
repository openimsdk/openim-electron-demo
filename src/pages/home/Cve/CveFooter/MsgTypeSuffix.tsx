import { PlusCircleOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message,Image as AntdImage } from "antd";
import { FC, forwardRef, useImperativeHandle } from "react";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { base64toFile, cosUpload, getPicInfo, getVideoInfo, im } from "../../../../utils";
import Upload, { RcFile } from "antd/lib/upload";
import { PIC_MESSAGE_THUMOPTION } from "../../../../config";
import { faceMap } from "../../../../constants/faceType";
import send_id_card from "@/assets/images/send_id_card.png";
import send_pic from "@/assets/images/send_pic.png";
import send_video from "@/assets/images/send_video.png";
import send_file from "@/assets/images/send_file.png";
import { useTranslation } from "react-i18next";
import { getCosAuthorization } from "../../../../utils/cos";
import { MessageType } from "../../../../utils/open_im_sdk_wasm/types/enum";

type MsgTypeSuffixProps = {
    choseCard:()=>void
    faceClick:(face:typeof faceMap[0])=>void;
    sendMsg: (nMsg: string, type: MessageType,uid?:string,gid?:string,fileArrayBuffer?:ArrayBuffer,snpArrayBuffer?:ArrayBuffer) => void;
}

const MsgTypeSuffix:FC<MsgTypeSuffixProps> = ({choseCard,faceClick,sendMsg},ref) => {
  const { t } = useTranslation();

  const getFileData = (data: Blob):Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result as ArrayBuffer);
      };
      reader.readAsArrayBuffer(data);
    });
  };

  const imgMsg = async (file: RcFile) => {
    const fileArrayBuffer = await getFileData(file as Blob)
    const { width, height } = await getPicInfo(file);
      const sourcePicture = {
        uuid: file.uid,
        type: file.type,
        // type: '.png',
        size: file.size,
        width,
        height,
        url: "",
      };
      const imgInfo = {
        sourcePicture,
        snapshotPicture: sourcePicture,
        bigPicture: sourcePicture,
      };
      const msgStr = (await im.createImageMessage(imgInfo)).data;
      const offlinePushInfo = {
        title: "你有一条新消息",
        desc: "",
        ex: "",
        iOSPushSound: "+1",
        iOSBadgeCount: true,
      };
    sendMsg(msgStr, MessageType.PICTUREMESSAGE, undefined, undefined, fileArrayBuffer);
  };

  const videoMsg = async (file: RcFile) => {
    const fileArrayBuffer = await getFileData(file as Blob)
    const info = await getVideoInfo(URL.createObjectURL(file));
    const snpFile = base64toFile(info.snapshotUrl);
    const snpArrayBuffer = await getFileData(snpFile as Blob)
    const { width, height } = await getPicInfo(snpFile as any);
    const videoInfo = {
      videoPath: "",
      duration: parseInt(info.duration + ""),
      videoType: file.type,
      snapshotPath: "",
      videoUUID: file.uid,
      videoUrl: "",
      videoSize: file.size,
      snapshotUUID: file.uid,
      snapshotSize: snpFile.size,
      snapshotUrl: "",
      snapshotWidth: width,
      snapshotHeight: height,
    };
    const { data } = await im.createVideoMessage(videoInfo);
    sendMsg(data, MessageType.VIDEOMESSAGE,undefined,undefined,fileArrayBuffer,snpArrayBuffer);
  };

  const fileMsg = async (file: RcFile) => {
    const fileArrayBuffer = await getFileData(file as Blob)
    const fileInfo = {
      filePath: "",
      fileName: file.name,
      uuid: file.uid,
      sourceUrl: "",
      fileSize: file.size,
    };
    const { data } = await im.createFileMessage(fileInfo);
    sendMsg(data, MessageType.FILEMESSAGE,undefined,undefined,fileArrayBuffer);
  };


  const sendCosMsg = async (uploadData: UploadRequestOption, type: string) => {
    const fileType = (uploadData.file as RcFile).type;
    switch (type) {
      case "pic":
        imgMsg(uploadData.file as RcFile);
        break;
      case "video":
        videoMsg(uploadData.file as RcFile);
        break;
      case "file":
        if (fileType.includes("image")) {
          imgMsg(uploadData.file as RcFile);
        } else if (fileType.includes("video")) {
          videoMsg(uploadData.file as RcFile);
        } else {
          fileMsg(uploadData.file as RcFile);
        }
        break;
      default:
        break;
    }
  };
  
  const menus = [
    {
      title: t("SendCard"),
      icon: send_id_card,
      method: choseCard,
      type: "card",
    },
    {
      title: t("SendFile"),
      icon: send_file,
      method: sendCosMsg,
      type: "file",
    },
    {
      title: t("SendVideo"),
      icon: send_video,
      method: sendCosMsg,
      type: "video",
    },
    {
      title: t("SendPicture"),
      icon: send_pic,
      method: sendCosMsg,
      type: "pic",
    },
  ];

  useImperativeHandle(ref,()=>({
    sendImageMsg:imgMsg
  }))

  const FaceType = () => (
    <div style={{ boxShadow: "0px 4px 25px rgb(0 0 0 / 16%)" }} className="face_container">
      {faceMap.map((face) => (
        <div key={face.context} onClick={() => faceClick(face)} className="face_item">
          <AntdImage preview={false} width={24} src={face.src} />
        </div>
      ))}
    </div>
  );

  const switchType = (type:string) => {
    switch (type) {
      case "pic":
        return "image/*"
      case "video":
        return "video/*"
      case "file":
        return "*"
      default:
        break;
    }
  }

  const MsgType = () => (
    <Menu className="input_menu">
      {menus.map((m: any) => {
        if (m.type === "card") {
          return (
            <Menu.Item key={m.title} onClick={m.method} icon={<img src={m.icon} />}>
              {m.title}
            </Menu.Item>
          );
        } else {
          return (
            <Menu.Item key={m.title} icon={<img src={m.icon} />}>
              <Upload
                accept={switchType(m.type)}
                key={m.title}
                action={""}
                customRequest={(data) => m.method(data, m.type)}
                showUploadList={false}
              >
                {m.title}
              </Upload>
            </Menu.Item>
          );
        }
      })}
    </Menu>
  );

  return (
    <div className="suffix_container">
      <Dropdown overlayClassName="face_type_drop" overlay={FaceType} placement="topLeft" arrow>
        {/* <Tooltip title="表情"> */}
        <SmileOutlined style={{ paddingRight: "8px" }} />
        {/* </Tooltip> */}
      </Dropdown>

      <Dropdown overlayClassName="msg_type_drop" overlay={MsgType} placement="topCenter" arrow>
        <PlusCircleOutlined />
      </Dropdown>
    </div>
  );
};

// @ts-ignore
export default forwardRef(MsgTypeSuffix);
