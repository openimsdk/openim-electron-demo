import "xgplayer/dist/index.min.css";

import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { FC, memo, useEffect } from "react";
import { SimplePlayer } from "xgplayer";
import { I18N } from "xgplayer";
import ZH from "xgplayer/es/lang/zh-cn";
import Error from "xgplayer/es/plugins/error";
import Fullscreen from "xgplayer/es/plugins/fullscreen";
import Mobile from "xgplayer/es/plugins/mobile";
import PC from "xgplayer/es/plugins/pc";
import Play from "xgplayer/es/plugins/play";
import Progress from "xgplayer/es/plugins/progress";
import Start from "xgplayer/es/plugins/start";
import Time from "xgplayer/es/plugins/time";

I18N.use(ZH);

const VideoPlayerModal: FC<{ url: string; closeOverlay: () => void }> = ({
  url,
  closeOverlay,
}) => {
  useEffect(() => {
    new SimplePlayer({
      id: "video_player",
      url,
      plugins: [Start, PC, Mobile, Progress, Play, Time, Error, Fullscreen],
    });
  }, []);

  return (
    <Modal
      title={null}
      footer={null}
      closeIcon={<CloseOutlined className="text-lg font-medium text-gray-400" />}
      open
      centered
      onCancel={closeOverlay}
      maskStyle={{
        opacity: 0,
        transition: "none",
      }}
      className="no-padding-modal"
      maskTransitionName=""
    >
      <div id="video_player"></div>
    </Modal>
  );
};

export default memo(VideoPlayerModal);
