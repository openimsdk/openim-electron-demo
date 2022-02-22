import { PlusCircleOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message,Image as AntdImage } from "antd";
import { FC, forwardRef, useImperativeHandle } from "react";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { cosUpload, getPicInfo, getVideoInfo, im } from "../../../../utils";
import Upload, { RcFile } from "antd/lib/upload";
import { PICMESSAGETHUMOPTION } from "../../../../config";
import { faceMap } from "../../../../constants/faceType";
import { messageTypes } from "../../../../constants/messageContentType";
import send_id_card from "@/assets/images/send_id_card.png";
import send_pic from "@/assets/images/send_pic.png";
import send_video from "@/assets/images/send_video.png";
import send_file from "@/assets/images/send_file.png";
import { useTranslation } from "react-i18next";
import { getCosAuthorization } from "../../../../utils/cos";

type MsgTypeSuffixProps = {
    choseCard:()=>void
    faceClick:(face:typeof faceMap[0])=>void;
    sendMsg: (nMsg: string, type: messageTypes) => void;
}

const MsgTypeSuffix:FC<MsgTypeSuffixProps> = ({choseCard,faceClick,sendMsg},ref) => {
  const { t } = useTranslation();

  const imgMsg = async (file: RcFile, url: string) => {
    const { width, height } = await getPicInfo(file);
    const sourcePicture = {
      uuid: file.uid,
      type: file.type,
      size: file.size,
      width,
      height,
      url,
    };
    const snapshotPicture = {
      uuid: file.uid,
      type: file.type,
      size: file.size,
      width: 200,
      height: 200,
      url: url + PICMESSAGETHUMOPTION,
    };
    const imgInfo = {
      sourcePicture,
      snapshotPicture,
      bigPicture: sourcePicture,
    };
    const { data } = await im.createImageMessage(imgInfo);
    sendMsg(data, messageTypes.PICTUREMESSAGE);
  };

  const videoMsg = async (file: RcFile, url: string) => {
    const snp = "https://echat-1302656840.cos.ap-chengdu.myqcloud.com/rc-upload-1638518718431-15video_cover.png?imageView2/1/w/200/h/200/rq/80";
    const duration = await getVideoInfo(file);
    const videoInfo = {
      videoPath: url,
      duration,
      videoType: file.type,
      snapshotPath: snp,
      videoUUID: file.uid,
      videoUrl: url,
      videoSize: file.size,
      snapshotUUID: file.uid,
      snapshotSize: 117882,
      snapshotUrl: snp,
      snapshotWidth: 1024,
      snapshotHeight: 1024,
    };
    const { data } = await im.createVideoMessage(videoInfo);
    sendMsg(data, messageTypes.VIDEOMESSAGE);
  };

  const fileMsg = async (file: RcFile, url: string) => {
    const fileInfo = {
      filePath: url,
      fileName: file.name,
      uuid: file.uid,
      sourceUrl: url,
      fileSize: file.size
    }
    const { data } = await im.createFileMessage(fileInfo)
    sendMsg(data, messageTypes.FILEMESSAGE);
  }


  const sendCosMsg = async (uploadData: UploadRequestOption, type: string) => {
    await getCosAuthorization();
    cosUpload(uploadData)
      .then((res) => {
        switch (type) {
          case "pic":
            imgMsg(uploadData.file as RcFile, res.url);
            break;
          case "video":
            videoMsg(uploadData.file as RcFile, res.url);
            break;
          case "file":
            fileMsg(uploadData.file as RcFile, res.url);
            break;
          default:
            break;
        }
      })
      .catch((err) => message.error(t("UploadFailed")));
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
