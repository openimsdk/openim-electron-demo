import "xgplayer/dist/index.min.css";

import { memo, useEffect } from "react";
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

const VideoPlayer = ({
  url,
  autoplay,
  poster,
}: {
  url: string;
  autoplay?: boolean;
  poster?: string;
}) => {
  useEffect(() => {
    new SimplePlayer({
      id: "video_player",
      url,
      autoplay,
      poster,
      plugins: [Start, PC, Mobile, Progress, Play, Time, Error, Fullscreen],
    });
  }, [url]);

  return <div id="video_player" />;
};

export default memo(VideoPlayer);
