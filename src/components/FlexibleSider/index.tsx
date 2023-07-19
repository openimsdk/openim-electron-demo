import clsx from "clsx";
import * as React from "react";

import styles from "./flexible-sider.module.scss";

const FlexibleSider = ({
  needHidden,
  children,
  wrapClassName,
}: {
  needHidden: boolean;
  wrapClassName?: string;
  children: React.ReactNode;
}) => (
  <aside
    className={clsx(
      "relative bg-white dark:text-white",
      { "max-[600px]:hidden": needHidden },
      { "max-[600px]:!max-w-none max-[600px]:!basis-full": !needHidden },
    )}
  >
    <div
      className={`absolute bottom-0 left-0 right-1 top-0 z-10 overflow-hidden ${
        wrapClassName ?? ""
      }`}
    >
      {children}
    </div>
    <div className={styles.sider_resize}></div>
    <div className={styles.sider_bar}></div>
  </aside>
);

export default FlexibleSider;
