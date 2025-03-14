import clsx from "clsx";
import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useImperativeHandle,
  useState,
} from "react";

type IAlphabetIndexProps = {
  indexList: string[];
  scrollToLetter: (idx: number) => void;
};

const AlphabetIndex: ForwardRefRenderFunction<
  { updateCurrentLetter: (letter: string) => void },
  IAlphabetIndexProps
> = ({ indexList, scrollToLetter }, ref) => {
  const [currentAlphabet, setCurrentAlphabet] = useState("");

  const jumpToLetter = (idx: number, letter: string) => {
    scrollToLetter(idx);
    setCurrentAlphabet(letter);
  };

  useImperativeHandle(
    ref,
    () => ({
      updateCurrentLetter: (letter: string) => setCurrentAlphabet(letter),
    }),
    [],
  );

  return (
    <div className="absolute right-3 top-14 z-10 flex scale-90 flex-col items-center">
      {indexList.map((letter, idx) => (
        <span
          className={clsx("my-0.5 cursor-pointer text-xs text-[var(--sub-text)]", {
            "!text-[#0289FAFF]": currentAlphabet === letter,
          })}
          key={letter}
          onClick={() => jumpToLetter(idx, letter)}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

export default memo(forwardRef(AlphabetIndex));
