import { FC } from "react";
import { useTranslation } from "react-i18next";
import { throttle } from "throttle-debounce";
import { Loading } from "../Loading";
import styles from "./index.module.less";

type ScrollViewProps = {
  data: any[];
  fetchMoreData: () => void;
  hasMore: boolean;
  loading: boolean;
  height?: number;
  holdHeight?: number;
};

const ScrollView: FC<ScrollViewProps> = ({ data, fetchMoreData, hasMore, children, loading, height, holdHeight }) => {
  const { t } = useTranslation();

  const onScroll = async (e: any) => {
    const loadThreshold = 0 - e.target.scrollHeight + e.target.offsetHeight + (holdHeight ?? 30);

    if (e.target.scrollTop < loadThreshold && e.target.scrollTop !== 0) {
      if (loading || !hasMore) return;

      requestAnimationFrame(fetchMoreData);
    }
  };

  const throttleScroll = throttle(500, onScroll);

  return (
    <div onScroll={throttleScroll} id="scr_container" style={{ height: height ?? "100%" }} className={styles.con}>
      {children}
      {hasMore ? (
        <Loading style={{ backgroundColor: "transparent" }} size={data.length === 0 ? "large" : "small"} height={data.length === 0 ? `${height}px` ?? "600px" : "60px"} />
      ) : (
        <div className={styles.con_nomore}>{t("NoMore")}</div>
      )}
    </div>
  );
};

export default ScrollView;
