import { Row } from "antd";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import TopBar from "../../components/TopBar";
import styles from "./identity.module.less";
import mock from "./mock";
import Card from "./_comp/Card";

const Identity = () => {
  const { t } = useTranslation();

  const [activeId, setActiveId] = useState<number>();

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
            {mock.map((ele) => (
              <Card {...ele} key={ele.id} isSelected={activeId === ele.id} onClick={handleClick} />
            ))}
          </Row>
        </div>
      </div>

      <div className="login_bottom"></div>
    </div>
  );
};

export default Identity;
