import { message, Modal, Popover } from "antd";
import { FC, useEffect } from "react";

import ts_msg from "@/assets/images/ts_msg.png";
import re_msg from "@/assets/images/re_msg.png";
import rev_msg from "@/assets/images/rev_msg.png";
import mc_msg from "@/assets/images/mc_msg.png";
import sh_msg from "@/assets/images/sh_msg.png";
import del_msg from "@/assets/images/del_msg.png";
import cp_msg from "@/assets/images/cp_msg.png";
import download_msg from "@/assets/images/download_msg.png";
import { downloadFileUtil, events, im } from "../../../../../utils";
import CopyToClipboard from "react-copy-to-clipboard";
import { FORWARDANDMERMSG, MUTILMSG, REPLAYMSG, REVOKEMSG, DELETEMESSAGE } from "../../../../../constants/events";
import { messageTypes } from "../../../../../constants/messageContentType";
import { useTranslation } from "react-i18next";
import { MessageItem } from "../../../../../utils/open_im_sdk/types";

const canCpTypes = [messageTypes.TEXTMESSAGE, messageTypes.ATTEXTMESSAGE];
const canDownloadTypes = [messageTypes.PICTUREMESSAGE, messageTypes.VIDEOMESSAGE, messageTypes.FILEMESSAGE];

type MsgMenuProps = {
  visible: boolean;
  msg: MessageItem;
  isSelf: boolean;
  visibleChange: (v: boolean) => void;
};

const MsgMenu: FC<MsgMenuProps> = ({ visible, msg, isSelf, visibleChange, children }) => {
  const { t } = useTranslation();
  // const canHiddenTypes = [t("Copy"), t("Translate"), t("Reply"), t("Forward")];
  const canHiddenTypes = [t("Copy"), t("Translate"), t("Reply")];

  const forwardMsg = () => {
    events.emit(FORWARDANDMERMSG, "forward", JSON.stringify(msg));
  };

  const mutilMsg = () => {
    events.emit(MUTILMSG, true);
  };

  const replayMsg = () => {
    events.emit(REPLAYMSG, msg);
  };

  const revMsg = () => {
    im.revokeMessage(JSON.stringify(msg))
      .then((res) => {
        events.emit(REVOKEMSG, msg.clientMsgID);
      })
      .catch((err) => message.error(t("RevokeMessageFailed")));
  };

  const delComfirm = () => {
    Modal.confirm({
      title: t("DeleteMessage"),
      content: t("DeleteMessageConfirm"),
      okButtonProps: {
        type: "primary",
      },
      okType: "danger",
      onOk: delMsg,
    });
  };

  const delMsg = () => {
    im.deleteMessageFromLocalStorage(JSON.stringify(msg))
      .then((res) => {
        events.emit(DELETEMESSAGE, msg.clientMsgID);
      })
      .catch((err) => message.error(t("DeleteMessageFailed")));
  };

  const downloadFile = () => {
    let downloadUrl = "";
    switch (msg.contentType) {
      case messageTypes.PICTUREMESSAGE:
        downloadUrl = msg.pictureElem.sourcePicture.url
        break;
      case messageTypes.VIDEOMESSAGE:
        downloadUrl = msg.videoElem.videoUrl
        break;
      case messageTypes.FILEMESSAGE:
        downloadUrl = msg.fileElem.sourceUrl
        break;
      default:
        break;
    }
    const idx = downloadUrl.lastIndexOf("/");
    const fileName = downloadUrl.slice(idx + 1);
    downloadFileUtil(downloadUrl, fileName);
  };

  const menus = [
    // {
    //   title: t("Translate"),
    //   icon: ts_msg,
    //   method: () => {},
    //   hidden: false,
    // },
    {
      title: t("Forward"),
      icon: sh_msg,
      method: forwardMsg,
      hidden: false,
    },
    {
      title: t("Copy"),
      icon: cp_msg,
      method: () => {},
      hidden: false,
    },
    {
      title: t("Multiple"),
      icon: mc_msg,
      method: mutilMsg,
      hidden: false,
    },
    {
      title: t("Reply"),
      icon: re_msg,
      method: replayMsg,
      hidden: false,
    },
    {
      title: t("Revoke"),
      icon: rev_msg,
      method: revMsg,
      hidden: false,
    },
    {
      title: t("Delete"),
      icon: del_msg,
      method: delComfirm,
      hidden: false,
    },
    {
      title: t("Download"),
      icon: download_msg,
      method: downloadFile,
      hidden: false,
    },
  ];

  const switchMenu = (menu: typeof menus[0]) => {
    if (!canCpTypes.includes(msg.contentType) && canHiddenTypes.includes(menu.title)) {
      menu.hidden = true;
    }

    if( menu.title === t("Download") && !canDownloadTypes.includes(msg.contentType)){
      menu.hidden = true;
    }

    if (!isSelf && menu.title === t("Revoke")) {
      menu.hidden = true;
    }
    return menu.hidden ? null : menu.title === t("Copy") ? (
      <CopyToClipboard key={menu.title} onCopy={() => message.success("复制成功！")} text={msg.contentType === messageTypes.ATTEXTMESSAGE ? msg.atElem.text : msg.content}>
        <div onClick={menu.method} className="msg_menu_iem">
          <img src={menu.icon} />
          <span>{menu.title}</span>
        </div>
      </CopyToClipboard>
    ) : (
      <div key={menu.title} onClick={menu.method} className="msg_menu_iem">
        <img src={menu.icon} />
        <span>{menu.title}</span>
      </div>
    );
  };

  const PopContent = () => {
    return <div onClick={() => visibleChange(false)}>{menus.map((m) => switchMenu(m))}</div>;
  };

  return (
    <Popover onVisibleChange={(v) => visibleChange(v)} overlayClassName="msg_item_menu" content={PopContent} title={null} trigger="contextMenu" visible={visible}>
      <div>{children}</div>
    </Popover>
  );
};

export default MsgMenu;
