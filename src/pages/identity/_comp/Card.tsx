import { Avatar, Card as AntdCard, Col, Typography } from "antd";

import { memo } from "react";
import styles from "../identity.module.less";

type IProps = {
  id: number;
  avatar: string;
  name: string;
  job: string;
  description: string;
  isSelected: boolean;
  onClick: (id: number) => void;
};

const Card = memo(function (props: IProps) {
  const { id, avatar, name, job, description, isSelected, onClick: clickCb } = props;

  return (
    <Col span={12}>
      <AntdCard hoverable={true} style={{ borderRadius: "16px" }} onClick={() => clickCb(id)}>
        <div className={styles["identity-card"]}>
          <Avatar src={avatar} size="large" />

          <div className={styles["identity-body"]}>
            <Typography.Title level={3}>
              <span className={styles["identity-name"]}>{name}</span>
              <span className={styles["identity-job"]}>{job}</span>
            </Typography.Title>

            <Typography.Text ellipsis={{ tooltip: description }} className={styles["identity-description"]} type="secondary">
              {description}
            </Typography.Text>
          </div>

          {isSelected && <div className={styles["identity-circle"]}></div>}
        </div>
      </AntdCard>
    </Col>
  );
});

export default Card;
