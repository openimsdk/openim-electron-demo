import "xgplayer/dist/index.min.css";

import { CloseOutlined } from "@ant-design/icons";
import { App } from "antd";
import { SimplePlayer } from "xgplayer";
import { I18N } from "xgplayer";
import EN from "xgplayer/es/lang/en";
import Error from "xgplayer/es/plugins/error";
import Fullscreen from "xgplayer/es/plugins/fullscreen";
import Mobile from "xgplayer/es/plugins/mobile";
import PC from "xgplayer/es/plugins/pc";
import Play from "xgplayer/es/plugins/play";
import Progress from "xgplayer/es/plugins/progress";
import Start from "xgplayer/es/plugins/start";
import Time from "xgplayer/es/plugins/time";

I18N.use(EN);

export const useVideoPlayer = () => {
  const { modal } = App.useApp();

  const showVideoPlayer = (url: string) => {
    const current = modal.confirm({
      title: null,
      icon: null,
      footer: null,
      width: 600,
      centered: true,
      maskTransitionName: "",
      className: "no-padding-modal",
      styles: {
        mask: {
          opacity: 0,
          transition: "none",
        },
      },
      content: (
        <div id="video_player_modal">
          <div
            className="absolute right-4 top-4 flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-black bg-opacity-15 "
            onClick={() => current.destroy()}
          >
            <CloseOutlined className="text-[var(--sub-text)]" rev={undefined} />
          </div>
        </div>
      ),
    });
    setTimeout(() => {
      new SimplePlayer({
        id: "video_player_modal",
        url,
        autoplay: true,
        plugins: [Start, PC, Mobile, Progress, Play, Time, Error, Fullscreen],
      });
    }, 50);
  };

  return { showVideoPlayer };
};
