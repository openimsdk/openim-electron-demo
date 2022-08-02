import { user_members } from "@/api/qcole";
import { UserMember } from "@/api/qcole/interface";
import { message, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TopBar from "../../components/TopBar";
import styles from "./identity.module.less";
import Card from "./_comp/Card";

const Identity = () => {
  const { t } = useTranslation();

  const [mermbers, setMembers] = useState<UserMember[]>();
  const [activeId, setActiveId] = useState<number>();

  useEffect(() => {
    user_members()
      .then((res) => {
        setMembers(res.user_members);
      })
      .catch((err) => {
        message.error("服务器发生错误, 请联系管理员");
      });
  }, []);

  const handleClick = useCallback((id: number) => {
    setActiveId(id);
  }, []);

  return (
    <div className="login_container">
      <TopBar />

      <div className="login_form">
        <div className="form_logo"></div>

        <div className="form_title mb_gap">{t("LoginFormTitle")}</div>

        <div className={styles["identity-container"]}>
          <Row gutter={[24, 32]} justify="space-between" wrap={true}>
            {mermbers!?.length > 0 && mermbers!.map((ele) => <Card {...ele} key={ele.id} isSelected={activeId === ele.id} onClick={handleClick} />)}
          </Row>
        </div>
      </div>

      <div className="login_bottom"></div>
    </div>
  );
};

export default Identity;
