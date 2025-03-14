import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { secondsToMS } from "@/utils/common";

export type CounterHandle = {
  getTimeStr: () => string;
};
const Counter: ForwardRefRenderFunction<
  CounterHandle,
  {
    isConnected: boolean;
    className?: string;
  }
> = ({ isConnected, className }, ref) => {
  const [count, setCount] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isConnected) {
      countStart();
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [isConnected]);

  const countStart = () => {
    timer.current = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
  };

  useImperativeHandle(ref, () => ({
    getTimeStr: () => secondsToMS(count),
  }));

  return (
    <div className={className}>
      <div className="text-sm text-white">{secondsToMS(count)}</div>
    </div>
  );
};

export const ForwardCounter = memo(forwardRef(Counter));
