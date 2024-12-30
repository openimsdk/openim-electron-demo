import "xgplayer/dist/index.min.css";

import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
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

const VideoPlayer: ForwardRefRenderFunction<
  {
    pausePlay: () => void;
  },
  {
    url: string;
    autoplay?: boolean;
    poster?: string;
  }
> = ({ url, autoplay, poster }, ref) => {
  const player = useRef<SimplePlayer>();
  useEffect(() => {
    player.current = new SimplePlayer({
      id: "video_player",
      url,
      autoplay,
      poster,
      plugins: [Start, PC, Mobile, Progress, Play, Time, Error, Fullscreen],
    });
  }, [url]);

  const pausePlay = () => {
    if (!player.current?.paused) {
      player.current?.pause();
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      pausePlay,
    }),
    [],
  );

  return <div id="video_player" />;
};

export default memo(forwardRef(VideoPlayer));
