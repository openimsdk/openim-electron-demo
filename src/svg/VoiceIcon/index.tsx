import clsx from "clsx";
import { FC, SVGProps } from "react";

import styles from "./voice.module.scss";

interface IVoiceIconProps extends SVGProps<SVGSVGElement> {
  playing?: boolean;
}

const VoiceIcon: FC<IVoiceIconProps> = (props) => {
  const { playing } = props;

  const svgProps = { ...props, playing: undefined };

  return (
    <svg
      {...svgProps}
      className={clsx("scale-90", props.className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g fill="#fff" stroke="#707070" opacity={0}>
        <rect stroke="none" width="24" height="24" />
        <rect fill="none" x="0.5" y="0.5" width="23" height="23" />
      </g>
      <g transform="translate(6.003 3)">
        <path
          fill="#0289FA"
          d="M1.27,0A1.285,1.285,0,1,1,0,1.29,1.283,1.283,0,0,1,1.27,0Z"
          transform="translate(0 7.963)"
        />
        <path
          fill="#0289FA"
          className={clsx(playing && styles.md)}
          d="M1.223.1a6.111,6.111,0,0,1,2.87,5.28,6.1,6.1,0,0,1-2.94,5.31.76.76,0,0,1-1.05-.27.778.778,0,0,1,.27-1.05.035.035,0,0,1,.02-.01,4.58,4.58,0,0,0,2.17-3.98,4.565,4.565,0,0,0-2.12-3.95A.768.768,0,0,1,.193.369.761.761,0,0,1,1.223.1Z"
          transform="translate(2.797 4.113)"
        />
        <path
          fill="#0289FA"
          className={clsx(playing && styles.lg)}
          d="M.317,17.667a.791.791,0,0,1,.19-1.08,9.107,9.107,0,0,0,4.08-7.53,9.143,9.143,0,0,0-4.25-7.65A.782.782,0,0,1,.127.337a.765.765,0,0,1,1.04-.22,10.667,10.667,0,0,1,4.95,8.94,10.645,10.645,0,0,1-4.74,8.8A.748.748,0,0,1,.317,17.667Z"
          transform="translate(5.88 0)"
        />
      </g>
    </svg>
  );
};

export default VoiceIcon;
