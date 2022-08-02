import { Avatar, Card as AntdCard, Col, Typography } from "antd";

import { memo, useCallback } from "react";
import styles from "../identity.module.less";
import { UserMember } from "@/api/qcole/interface";

type IProps = {
  isSelected: boolean;
  onClick: (id: number) => void;
} & UserMember;

const Card = memo(function (props: IProps) {
  const {
    isSelected,
    onClick: clickCb,
    id,
    member: {
      chinese_name,
      avatar_thumb_url,
      token: memberToken,
      type,
      company: { chinese_name: company_chinese_name },
    },
  } = props;

  const handleClick = useCallback(() => {
    clickCb(id);
    localStorage.setItem("memberToken", memberToken);
    // 进入聊天主页
  }, [clickCb, id, memberToken]);

  return (
    <Col span={12}>
      <AntdCard hoverable={true} style={{ borderRadius: "16px" }} onClick={handleClick}>
        <div className={styles["identity-card"]}>
          <Avatar src={avatar_thumb_url} size="large" />

          <div className={styles["identity-body"]}>
            <Typography.Title level={3}>
              <span className={styles["identity-name"]}>{chinese_name}</span>
              <span className={styles["identity-job"]}>{type}</span>
            </Typography.Title>

            <Typography.Text ellipsis={{ tooltip: company_chinese_name }} className={styles["identity-description"]} type="secondary">
              {company_chinese_name}
            </Typography.Text>
          </div>

          {isSelected && <div className={styles["identity-circle"]}></div>}
        </div>
      </AntdCard>
    </Col>
  );
});

export default Card;
