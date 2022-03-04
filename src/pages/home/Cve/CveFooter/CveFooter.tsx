import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";
import { Button, Layout, message } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { base64toFile, contenteditableDivRange, cosUploadNomal, events, im, isSingleCve, move2end } from "../../../../utils";
import { messageTypes } from "../../../../constants/messageContentType";
import { ATSTATEUPDATE, FORWARDANDMERMSG, ISSETDRAFT, MUTILMSG, MUTILMSGCHANGE, REPLAYMSG } from "../../../../constants/events";
import CardMsgModal from "../components/CardMsgModal";
import { faceMap } from "../../../../constants/faceType";

import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "../../../../store";
import MsgTypeSuffix from "./MsgTypeSuffix";
import { useTranslation } from "react-i18next";
import ContentEditable, { ContentEditableEvent } from "../../../../components/EdtableDiv";
import { useLatest } from "ahooks";
import { ConversationItem, FriendItem, MessageItem } from "../../../../utils/open_im_sdk/types";
import { getCosAuthorization } from "../../../../utils/cos";

const { Footer } = Layout;

type CveFooterProps = {
  sendMsg: (nMsg: string, type: messageTypes) => void;
  curCve: ConversationItem;
};

type AtItem = {
  id: string;
  name: string;
  tag: string;
};

const CveFooter: FC<CveFooterProps> = ({ sendMsg, curCve }) => {
  const inputRef = useRef<any>(null);
  const [msgContent, setMsgContent] = useState<string>("");
  const latestContent = useLatest(msgContent);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [flag, setFlag] = useState(false);
  const latestFlag = useLatest(flag);
  const [replyMsg, setReplyMsg] = useState<MessageItem>();
  const [mutilSelect, setMutilSelect] = useState(false);
  const [crardSeVis, setCrardSeVis] = useState(false);
  const [mutilMsg, setMutilMsg] = useState<MessageItem[]>([]);
  const [atList, setAtList] = useState<AtItem[]>([]);
  const groupMemberList = useSelector((state: RootState) => state.contacts.groupMemberList, shallowEqual);
  const { t, i18n } = useTranslation();
  const suffixRef = useRef<any>(null);

  useEffect(() => {
    events.on(REPLAYMSG, replyHandler);
    events.on(MUTILMSG, mutilHandler);
    window.electron && window.electron.addIpcRendererListener("ScreenshotData",screenshotHandler,"screenshotListener")
    return () => {
      events.off(REPLAYMSG, replyHandler);
      events.off(MUTILMSG, mutilHandler);
      window.electron && window.electron.removeIpcRendererListener("screenshotListener");
    };
  }, []);

  useEffect(() => {
    events.on(ATSTATEUPDATE, atHandler);
    events.on(ISSETDRAFT, setDraft);
    return () => {
      events.off(ATSTATEUPDATE, atHandler);
      events.off(ISSETDRAFT, setDraft);
    };
  }, [atList]);

  useEffect(() => {
    events.on(MUTILMSGCHANGE, mutilMsgChangeHandler);
    return () => {
      events.off(MUTILMSGCHANGE, mutilMsgChangeHandler);
    };
  }, [mutilMsg]);

  useEffect(() => {
    if (atList.length > 0) {
      setAtList([]);
    }
    if (curCve.draftText !== "") {
      parseDrft(curCve.draftText);
    } else {
      setMsgContent("");
    }
    setMutilMsg([]);
    return () => {
      setDraft(curCve)
    }
  }, [curCve]);

  const blobToDataURL = (blob: File, cb: (base64: string) => void) => {
    let reader = new FileReader();
    reader.onload = function (evt) {
      let base64 = evt.target?.result;
      cb(base64 as string);
    };
    reader.readAsDataURL(blob);
  };

  const textInit = async (e: any) => {
    const clp = (e.originalEvent || e).clipboardData;
    if (clp && clp.items[0].type.indexOf("image") === -1) {
      e.preventDefault();
      const text = clp.getData("text/plain") || "";
      document.execCommand("insertText", false, text);
    } else if (clp && clp.items[0].type.indexOf("image") > -1) {
      e.preventDefault();
      const file = clp.items[0].getAsFile();
      blobToDataURL(file, (base64) => {
        let img = `<img style="vertical-align:bottom" class="screenshot_el" src="${base64}" alt="" >`;
        document.execCommand("insertHTML", false, img);
      });
    }
  };

  const screenshotHandler = (ev:any,base64:string) => {
    let img = `<img style="vertical-align:bottom" class="screenshot_el" src="${base64}" alt="" >`;
    setMsgContent(latestContent.current + img);
  }

  const reParseEmojiFace = (text: string) => {
    faceMap.map((f) => {
      const idx = text.indexOf(f.context);
      if (idx > -1) {
        const faceStr = `<img class="face_el" alt="${f.context}" style="padding-right:2px" width="24px" src="${f.src}">`;
        text = text.replaceAll(f.context, faceStr);
      }
    });
    return text;
  };

  const reParseAt = (text: string) => {
    const pattern = /@\S+\s/g;
    const arr = text.match(pattern);
    let tmpAts: AtItem[] = [];

    arr?.map((uid) => {
      const member = groupMemberList.find((gm) => gm.userID === uid.slice(1, -1));
      if (member) {
        const tag = `<b class="at_el" data_id="${member.userID}" data_name="${member.nickname}" contenteditable="false" style="color:#428be5"> @${member.nickname}</b>`;
        text = text.replaceAll(uid, tag);
        tmpAts.push({ id: member.userID, name: member.nickname, tag });
      }
    });
    setAtList(tmpAts);
    return text;
  };

  const parseDrft = (text: string) => {
    setMsgContent(reParseEmojiFace(reParseAt(text)));
  };

  const atHandler = (id: string, name: string) => {
    if (replyMsg) {
      setReplyMsg(undefined);
    }
    if (atList.findIndex((au) => au.id === id) === -1) {
      const tag = `<b class="at_el" data_id="${id}" data_name="${name}" contenteditable="false" style="color:#428be5"> @${name}</b>`;
      setAtList([...atList, { id, name, tag }]);
      setMsgContent(latestContent.current + tag);
      move2end(inputRef.current!.el);
    }
  };

  const mutilHandler = (flag: boolean) => {
    setMutilSelect(flag);
  };

  const mutilMsgChangeHandler = (checked: boolean, msg: MessageItem) => {
    let tms = [...mutilMsg];
    if (checked) {
      tms = [...tms, msg];
    } else {
      const idx = tms.findIndex((t) => t.clientMsgID === msg.clientMsgID);
      tms.splice(idx, 1);
    }
    setMutilMsg(tms);
  };

  const replyHandler = (msg: MessageItem) => {
    setReplyMsg(msg);
  };

  const parseImg = (text: string) => {
    const pattern = /\<img.*?\">/g;
    const patternArr = text.match(pattern);

    if (patternArr && patternArr.length > 0) {
      patternArr.map((img) => {
        text = text.replaceAll(img, "");
      });
    }

    return text;
  };

  const setDraft = (cve: ConversationItem) => {
    if (cve.draftText !== "" || latestContent.current !== "") {
      let text = latestContent.current;
      text = parseEmojiFace(text);
      // text = parseImg(text).text;
      const option = {
        conversationID: cve.conversationID,
        draftText: atList.length > 0 ? parseAt(text) : text,
      };

      im.setConversationDraft(option)
        .then((res) => {})
        .catch((err) => {})
        .finally(() => setMsgContent(""));
    }
  };

  const parseMsg = (msg: MessageItem) => {
    switch (msg.contentType) {
      case messageTypes.TEXTMESSAGE:
        return msg.content;
      case messageTypes.ATTEXTMESSAGE:
        return msg.atElem.text;
      case messageTypes.PICTUREMESSAGE:
        return t("PictureMessage");
      case messageTypes.VIDEOMESSAGE:
        return t("VideoMessage");
      case messageTypes.VOICEMESSAGE:
        return t("VoiceMessage");
      case messageTypes.LOCATIONMESSAGE:
        return t("LocationMessage");
      case messageTypes.MERGERMESSAGE:
        return t("MergeMessage");
      case messageTypes.FILEMESSAGE:
        return t("FileMessage");
      case messageTypes.QUOTEMESSAGE:
        return t("QuoteMessage");
      default:
        break;
    }
  };

  const quoteMsg = async (text: string) => {
    const { data } = await im.createQuoteMessage({ text, message: JSON.stringify(replyMsg) });
    sendMsg(data, messageTypes.QUOTEMESSAGE);
    reSet();
  };

  const ReplyPrefix = () =>
    replyMsg ? (
      <div className="reply">
        <CloseCircleFilled onClick={() => setReplyMsg(undefined)} />
        <div className="reply_text">
          {t("Reply")} <span>{replyMsg?.senderNickname}:</span> {parseMsg(replyMsg!)}
        </div>
      </div>
    ) : null;

  const switchMessage = (type: string) => {
    let text = latestContent.current;
    text = parseImg(parseEmojiFace(text));
    text = parseBr(text);
    forEachImgMsg();
    if (text === "") return;
    switch (type) {
      case "text":
        sendTextMsg(text);
        break;
      case "at":
        sendAtTextMsg(parseAt(text));
        break;
      case "quote":
        quoteMsg(text);
        break;
      default:
        break;
    }
  };

  const reSet = () => {
    setMsgContent("");
    setReplyMsg(undefined);
    setAtList([]);
    setFlag(false);
    setDraft(curCve);
  };

  const faceClick = (face: typeof faceMap[0]) => {
    const faceEl = `<img class="face_el" alt="${face.context}" style="padding-right:2px" width="24px" src="${face.src}">`;
    move2end(inputRef.current!.el);
    setMsgContent(latestContent.current + faceEl);
  };

  const parseAt = (text: string) => {
    atList.map((at) => {
      text = text.replaceAll(at.tag, `@${at.id} `);
    });
    return text;
  };

  const parseEmojiFace = (text: string) => {
    const faceEls = [...document.getElementsByClassName("face_el")] as HTMLImageElement[];
    if (faceEls.length > 0) {
      faceEls.map((face) => {
        text = text.replaceAll(face.outerHTML, face.alt);
      });
    }
    return text;
  };

  const forEachImgMsg = () => {
    const screenshotEls = [...document.getElementsByClassName("screenshot_el")] as HTMLImageElement[];
    if (screenshotEls.length > 0) {
      screenshotEls[screenshotEls.length - 1].alt = "last";
      screenshotEls.map(async (snel) => {
        const item = base64toFile(snel.src);
        await getCosAuthorization();
        const { url } = await cosUploadNomal(item);
        await suffixRef.current.sendImageMsg(item, url);
        if (snel.alt === "last") {
          reSet();
        }
      });
    }
  };

  const parseBr = (mstr: string) => {
    if (mstr.slice(-4) === "<br>") {
      mstr = mstr.slice(0, -4);
    }
    mstr = mstr.replaceAll("<br>", "\n");
    return mstr;
  };

  const sendTextMsg = async (text: string) => {
    const { data } = await im.createTextMessage(text);
    // im.insertGroupMessageToLocalStorage({
    //   message: data,
    //   groupID: curCve.groupID,
    //   sendID: "17396220460",
    // }).then((res) => console.log(JSON.parse(res.data)));
    sendMsg(data, messageTypes.TEXTMESSAGE);
    reSet();
  };

  const sendAtTextMsg = async (text: string) => {
    const options = {
      text,
      atUserIDList: atList.map((au) => au.id),
    };
    const { data } = await im.createTextAtMessage(options);
    sendMsg(data, messageTypes.ATTEXTMESSAGE);
    reSet();
  };

  const typing = () => {
    if (isSingleCve(curCve)) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        updateTypeing(curCve.userID, "yes");
      }, 2000);
    }
  };

  const updateTypeing = (recvID: string, msgTip: string) => {
    im.typingStatusUpdate({ recvID, msgTip });
  };

  const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      contenteditableDivRange();
      move2end(inputRef.current!.el);
    }
    if (e.key === "Enter" && !e.ctrlKey) {
      e.preventDefault();
      if (latestContent.current && !latestFlag.current) {
        setFlag(true);
        switchMessage(replyMsg ? "quote" : atList.length > 0 ? "at" : "text");
      }
    }
  };

  const cancelMutil = () => {
    setMutilMsg([]);
    events.emit(MUTILMSG, false);
  };

  const selectRec = async () => {
    if (mutilMsg.length === 0) return;
    if (mutilMsg.length > 5) {
      message.info(t("MergeTip"));
      return;
    }

    let title = "";
    if (isSingleCve(curCve)) {
      title = i18n.language === "zh-cn" ? t("With") + curCve.showName + t("ChatRecord") : t("ChatRecord") + t("With") + curCve.showName;
    } else {
      title = i18n.language === "zh-cn" ? t("GroupChat") + curCve.showName + t("ChatRecord") : t("ChatRecord") + t("In") + curCve.showName;
    }
    const sortedMsg = mutilMsg.sort((a, b) => a.sendTime - b.sendTime);

    let tmm: string[] = [];
    const tmpArr = sortedMsg.length > 5 ? sortedMsg.slice(0, 4) : sortedMsg;
    tmpArr.map((m) => tmm.push(`${m.senderNickname}：${parseMsg(m)}`));

    const options = {
      messageList: [...sortedMsg],
      title,
      summaryList: tmm,
    };

    events.emit(FORWARDANDMERMSG, "merge", JSON.stringify(options));
  };

  const close = () => {
    setCrardSeVis(false);
  };

  const sendCardMsg = async (sf: FriendItem) => {
    const { data } = await im.createCardMessage(JSON.stringify(sf));
    sendMsg(data, messageTypes.CARDMESSAGE);
  };

  const choseCard = () => {
    setCrardSeVis(true);
  };

  const MutilAction = () => (
    <div className="footer_mutil">
      <CloseOutlined onClick={cancelMutil} />
      <Button onClick={selectRec} type="primary" shape="round">
        {t("MergerAndForward")}
      </Button>
    </div>
  );

  const onChange = (e: ContentEditableEvent) => {
    setMsgContent(e.target.value);
    const atels = [...document.getElementsByClassName("at_el")];
    let tmpAts: any = [];
    atels.map((at) => tmpAts.push({ id: at.attributes.getNamedItem("data_id")?.value, name: at.attributes.getNamedItem("data_name")?.value, tag: at.outerHTML }));
    setAtList(tmpAts);
    typing();
  };

  return (
    <Footer className="chat_footer">
      {mutilSelect ? (
        <MutilAction />
      ) : (
        <div style={{ position: "relative" }}>
          <ContentEditable
            className="input_div"
            style={{ paddingTop: replyMsg ? "32px" : "4px" }}
            placeholder={`${t("SendTo")} ${curCve.showName}`}
            ref={inputRef}
            html={msgContent}
            onChange={onChange}
            onKeyDown={keyDown}
            onPaste={textInit}
          />
          <ReplyPrefix />
          <MsgTypeSuffix ref={suffixRef} choseCard={choseCard} faceClick={faceClick} sendMsg={sendMsg} />
        </div>
      )}
      {crardSeVis && <CardMsgModal cb={sendCardMsg} visible={crardSeVis} close={close} />}
    </Footer>
  );
};

export default CveFooter;
