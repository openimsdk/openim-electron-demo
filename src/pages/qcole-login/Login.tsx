import { message } from "antd";
import login_bg from "@/assets/images/login_bg.png";
import LoginForm, { FormField, InfoField } from "./components/LoginForm";
import { useState } from "react";
import { Itype } from "../../@types/open_im";
import { useHistoryTravel, useLatest } from "ahooks";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import md5 from "md5";
import { login as loginApi, modify, register, sendSms, UsedFor, verifyCode } from "../../api/login";
import { im } from "../../utils";
import { getIMUrl, IMURL } from "../../config";
import { useDispatch } from "react-redux";
import { getSelfInfo, getAdminToken, setSelfInfo } from "../../store/actions/user";
import { getCveList } from "../../store/actions/cve";
import {
  getBlackList,
  getRecvFriendApplicationList,
  getFriendList,
  getRecvGroupApplicationList,
  getGroupList,
  getUnReadCount,
  getSentFriendApplicationList,
  getSentGroupApplicationList,
} from "../../store/actions/contacts";
import IMConfigModal from "./components/IMConfigModal";
import TopBar from "../../components/TopBar";
import { InitConfig } from "../../utils/open_im_sdk/types";
import { signin } from "@/api/qcole";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [num, setNum] = useState("");
  const [code, setCode] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { value: type, setValue: setType, back } = useHistoryTravel<Itype>("login");
  const lastType = useLatest(type);

  const finish = (values?: FormField | string | InfoField) => {
    switch (lastType.current) {
      case "login":
        if (!values) return;
        if (values === "register" || values === "modifySend") {
          toggle(values);
        } else {
          if ((values as FormField).phoneNo === undefined || (values as FormField).verifyCode === undefined) return false;

          // 秋炉的登录接口
          qcoleLogin(values as FormField);
        }
        break;
      case "register":
      case "modifySend":
        const isModify = lastType.current === "modifySend";
        sendSms((values as FormField)?.phoneNo as string, isModify ? UsedFor.Modify : UsedFor.Register)
          .then((res: any) => {
            if (res.errCode === 0) {
              message.success(t("SendSuccessTip"));
            } else if (res.errCode === 10007 || res.errCode === 10008) {
              handleError(res);
            }
            setNum((values as FormField)?.phoneNo);
            toggle(isModify ? "modifycode" : "vericode");
          })
          .catch((err) => handleError(err));
        break;
      case "modifycode":
      case "vericode":
        const isRegister = lastType.current === "vericode";
        verifyCode(num, values as string, isRegister ? UsedFor.Register : UsedFor.Modify)
          .then((res: any) => {
            setCode(values as string);
            toggle(isRegister ? "setPwd" : "modify");
          })
          .catch((err) => handleError(err));
        break;
      case "setPwd":
        register(num, code, md5((values as FormField).password as string))
          .then((res: any) => {
            imLogin(res.data.userID, res.data.token);
            toggle("setInfo");
          })
          .catch((err) => handleError(err));
        break;
      case "setInfo":
        toggle("success");
        setIMInfo(values as InfoField);
        break;
      case "modify":
        modify(num, code, md5((values as FormField).password as string))
          .then(() => {
            message.info(t("ModifyPwdSucTip"));
            toggle("login");
          })
          .catch((err) => handleError(err));

        break;
      default:
        break;
    }
  };

  const getCodeAgain = async () => {
    const isModify = type === "modifycode";
    const result: any = await sendSms(num, isModify ? UsedFor.Modify : UsedFor.Register);
    if (result.errCode === 0) {
      message.success(t("SendSuccessTip"));
    } else {
      handleError(result);
    }
  };

  const setIMInfo = (values: InfoField) => {
    values.userID = num;
    im.setSelfInfo(values)
      .then((res) => {
        dispatch(setSelfInfo(values));
        navigate("/", { replace: true });
      })
      .catch((err) => {
        toggle("setInfo");
        message.error(t("SetInfoFailed"));
      });
  };

  const qcoleLogin = (data: FormField) => {
    signin(data.phoneNo, data.verifyCode)
      .then((res) => {
        localStorage.setItem("userToken", res.token);
        // 跳转到身份选择页面
        navigate("/identity", { replace: true });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  const login = (data: FormField) => {
    loginApi(data.phoneNo, md5(data.password as string))
      .then((res) => {
        imLogin(res.data.userID, res.data.token);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  const imLogin = async (userID: string, token: string) => {
    localStorage.setItem(`improfile`, token);
    localStorage.setItem(`curimuid`, userID);
    //pc
    localStorage.setItem(`lastimuid`, userID);

    let url = getIMUrl();
    let platformID = window.electron ? window.electron.platform : 5;
    if (window.electron) {
      url = await window.electron.getLocalWsAddress();
    }
    const config: InitConfig = {
      userID,
      token,
      url,
      platformID,
    };
    im.login(config)
      .then((res) => {
        // 先进入身份页面
        if (lastType.current === "identity") {
          navigate("/identity", { replace: true });
        }

        // dispatch(getSelfInfo());
        // dispatch(getCveList());
        // dispatch(getFriendList());
        // dispatch(getRecvFriendApplicationList());
        // dispatch(getSentFriendApplicationList());
        // dispatch(getGroupList());
        // dispatch(getRecvGroupApplicationList());
        // dispatch(getSentGroupApplicationList());
        // dispatch(getUnReadCount());
        // dispatch(getBlackList());
        // dispatch(getAdminToken());
      })
      .catch((err) => handleError(err));
  };

  const switchError = (errCode: number) => {
    switch (errCode) {
      case 10002:
        return t("HasRegistered");
      case 10003:
        return t("NotRegistered");
      case 10004:
        return t("PasswordErr");
      case 10006:
        return t("RepeatSendCode");
      case 10007:
        return t("MailSendCodeErr");
      case 10008:
        return t("SmsSendCodeErr");
      case 10009:
        return t("CodeInvalidOrExpired");
      case 10010:
        return t("RegisterFailed");
      default:
        return undefined;
    }
  };

  const handleError = (error: any) => {
    if (lastType.current === "success") {
      toggle("login");
    }
    message.error(switchError(error.errCode) ?? error.errMsg ?? t("AccessFailed"));
  };

  const toggle = (mtype: Itype) => {
    setType(mtype);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="login_container">
      <TopBar />
      <div className="login_wapper">
        <div className="center_container">
          <LoginForm loading={loading} num={num} type={lastType.current} finish={finish} getCodeAgain={getCodeAgain} back={back} />
        </div>
        {isModalVisible && <IMConfigModal visible={isModalVisible} close={closeModal} />}
      </div>
      <div className="login_bottom"></div>
    </div>
  );
};

export default Login;
