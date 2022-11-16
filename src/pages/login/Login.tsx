import { message } from "antd";
import login_bg from "@/assets/images/login_bg.png";
import LoginForm, { FormField, InfoField } from "./components/LoginForm";
import { useState } from "react";
import { Itype } from "../../@types/open_im";
import { useHistoryTravel, useLatest } from "ahooks";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import md5 from "md5";
import { login as loginApi, register, reset, sendSms, UsedFor, verifyCode } from "../../api/login";
import { im } from "../../utils";
import { getIMApiUrl, getIMWsUrl } from "../../config";
import { useDispatch } from "react-redux";
import { getSelfInfo, setSelfInfo } from "../../store/actions/user";
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
  const [formData, setFormData] = useState({
    no: "",
    code: "",
    pwd: "",
    areaCode: "86",
  });

  const finish = (values?: FormField | string | InfoField) => {
    switch (lastType.current) {
      case "login":
        if (!values) return;
        if (values === "register" || values === "modifySend") {
          toggle(values);
        } else {
          if (!(values as FormField).phoneNo || !(values as FormField).password) return false;
          toggle("success");
          login(values as FormField);
        }
        break;
      case "register":
      case "modifySend":
        const isModify = lastType.current === "modifySend";
        sendSms((values as FormField)?.phoneNo as string, (values as FormField)?.areaCode, isModify ? UsedFor.Modify : UsedFor.Register)
          .then((res: any) => {
            setFormData({
              no: (values as FormField)?.phoneNo,
              pwd: "",
              code: "",
              areaCode: (values as FormField)?.areaCode,
            });
            toggle(isModify ? "modifycode" : "vericode");
          })
          .catch((err) => handleError(err));
        break;
      case "modifycode":
      case "vericode":
        const isRegister = lastType.current === "vericode";
        verifyCode(formData.no, formData.areaCode, values as string, isRegister ? UsedFor.Register : UsedFor.Modify)
          .then((res: any) => {
            setFormData({
              ...formData,
              no: formData.no,
              pwd: "",
              code: values as string,
            });
            toggle(isRegister ? "setPwd" : "modify");
          })
          .catch((err) => handleError(err));
        break;
      case "setPwd":
        setFormData({
          ...formData,
          pwd: (values as FormField).password as string,
        });
        toggle("setInfo");
        break;
      case "setInfo":
        toggle("success");
        const data = values as InfoField;
        // setIMInfo(values as InfoField);
        const options = {
          phoneNumber: formData.no,
          areaCode: formData.areaCode,
          verificationCode: formData.code,
          password: md5(formData.pwd),
          faceURL: data.faceURL,
          nickname: data.nickname,
        };
        register(options)
          .then((res: any) => {
            localStorage.setItem(`accountProfile-${res.data.userID}`, res.data.chatToken);
            imLogin(res.data.userID, res.data.imToken);
          })
          .catch((err) => handleError(err));
        break;
      case "modify":
        reset(formData.no, formData.areaCode, formData.code, md5((values as FormField).password as string))
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
    const result: any = await sendSms(formData.no, formData.areaCode, isModify ? UsedFor.Modify : UsedFor.Register);
    if (result.errCode === 0) {
      message.success(t("SendSuccessTip"));
    } else {
      handleError(result);
    }
  };

  const login = (data: FormField) => {
    localStorage.setItem('IMAccount',data.phoneNo)
    loginApi(data.phoneNo,data.areaCode, md5(data.password as string))
      .then((res) => {
        imLogin(res.data.userID, res.data.imToken);
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

    let platformID = window.electron ? window.electron.platform : 5;
    const config = {
      userID,
      token,
      apiAddress: getIMApiUrl(),
      wsAddress: getIMWsUrl(),
      platformID,
    };
    im.login(config)
      .then((res) => {
        dispatch(getSelfInfo());
        dispatch(getCveList());
        dispatch(getFriendList());
        dispatch(getRecvFriendApplicationList());
        dispatch(getSentFriendApplicationList());
        dispatch(getGroupList());
        dispatch(getRecvGroupApplicationList());
        dispatch(getSentGroupApplicationList());
        dispatch(getUnReadCount());
        dispatch(getBlackList());
        if (lastType.current === "success") {
          navigate("/", { replace: true });
        }
      })
      .catch((err) => handleError(err));
  };

  const switchLoginError = (errCode: number) => {
    switch (errCode) {
      case 20001:
        return t("HasRegistered");
      case 20002:
        return t("RepeatSendCode");
      case 20003:
        return t("InviteCodeError");
      case 20004:
        return t("IPLimit");
      case 30001:
        return t("CodeError");
      case 30002:
        return t("CodeExpired");
      case 30003:
        return t("InviteCodeUsed");
      case 30004:
        return t("InviteCodeNotFound");
      case 40001:
        return t("NotRegistered");
      case 40002:
        return t("PasswordErr");
      case 40003:
        return t("IPLimit");
      case 40004:
        return t("IPForbidden");
      case 50001:
        return t("TokenExpired");
      case 50002:
        return t("TokenNotFormatted");
      case 50003:
        return t("TokenNotValid");
      case 50004:
        return t("TokenUnknowError");
      case 50005:
        return t("TokenCreationError");
      default:
        return undefined;
    }
  };
  const handleError = (error: any) => {
    if (lastType.current === "success") {
      toggle("login");
    }
    message.error(switchLoginError(error.errCode) ?? error.errMsg ?? t("AccessFailed"));
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
          <div className="left_container">
            <div onDoubleClick={() => setIsModalVisible(true)} className="title">
              {t("LoginTitle")}
            </div>
            <span className="sub_title">{t("LoginSubTitle")}</span>
            <img src={login_bg} />
          </div>
          <LoginForm loading={loading} num={num} type={lastType.current} finish={finish} getCodeAgain={getCodeAgain} back={back} />
        </div>
        {/* {isModalVisible && <IMConfigModal visible={isModalVisible} close={closeModal} />} */}
      </div>
      <div className="login_bottom"></div>
    </div>
  );
};

export default Login;
