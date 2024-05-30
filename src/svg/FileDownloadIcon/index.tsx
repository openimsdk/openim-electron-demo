import clsx from "clsx";
import { FC } from "react";

import styles from "./file-download.module.scss";

const FileDownloadIcon: FC<{
  percent: number;
  pausing?: boolean;
  finished?: boolean;
  baseClassName?: string;
  arrowClassName?: string;
  size?: number;
}> = ({ percent, pausing, finished, size, baseClassName, arrowClassName }) => {
  const iconRender = () => {
    if (finished) {
      return (
        <path
          className={styles.triangle}
          d="M4.882,2.592a1.3,1.3,0,0,1,2.069,0l3.311,4.989c.445.67-.127,1.5-1.034,1.5H2.605c-.908,0-1.479-.828-1.034-1.5Z"
          transform="translate(16 5) rotate(90)"
        />
      );
    }
    if (pausing) {
      return (
        <g transform="translate(-269 -404.999)">
          <g transform="translate(-3 105.75)">
            <g className={styles["pause-bg"]} transform="translate(274.5 304.75)">
              <rect fill="#0089ff" width="11" height="11" />
              <rect stroke="none" x="0.5" y="0.5" width="10" height="10" />
            </g>
            <g transform="translate(180 -242)">
              <line
                className={styles["pause-base"]}
                strokeLinecap="round"
                y2="8"
                transform="translate(100 548.5)"
              />
            </g>
          </g>
          <g transform="translate(2.5 105.749)">
            <g className={styles["pause-bg"]} transform="translate(274.5 304.75)">
              <rect fill="#0089ff" width="11" height="11" />
              <rect stroke="none" x="0.5" y="0.5" width="10" height="10" />
            </g>
            <g transform="translate(180 -242)">
              <line
                className={styles["pause-base"]}
                strokeLinecap="round"
                y2="8"
                transform="translate(100 548.5)"
              />
            </g>
          </g>
        </g>
      );
    }

    return (
      <g transform="translate(-269 -406)">
        <g transform="translate(0 106)">
          <g transform="translate(180 -242)">
            <line
              className={clsx(styles.arrow, arrowClassName)}
              y2="8"
              transform="translate(100 548.5)"
            />
            <line
              className={clsx(styles.arrow, arrowClassName)}
              y1="4.5"
              transform="translate(96.818 553.318) rotate(-45)"
            />
            <line
              className={clsx(styles.arrow, arrowClassName)}
              y2="4.5"
              transform="translate(100.001 556.5) rotate(-135)"
            />
          </g>
        </g>
      </g>
    );
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? 22}
      height={size ?? 22}
      viewBox="0 0 22 22"
    >
      <circle
        className={clsx(styles.base, baseClassName)}
        cx="10"
        cy="10"
        r="10"
      ></circle>
      <circle
        className={clsx(styles.base, styles.wrap)}
        style={{ strokeDasharray: `calc(${percent} / 100 * 63),63` }}
        cx="10"
        cy="10"
        r="10"
      ></circle>
      {iconRender()}
    </svg>
  );
};

export default FileDownloadIcon;
