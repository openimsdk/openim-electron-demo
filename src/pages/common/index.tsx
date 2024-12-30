import { useVideoPlayer } from "./VideoPlayerModal";

export const useCommonModal = () => {
  const { showVideoPlayer } = useVideoPlayer();

  return { showVideoPlayer };
};
