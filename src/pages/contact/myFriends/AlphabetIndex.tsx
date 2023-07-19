import clsx from "clsx";
import { memo, useEffect, useState } from "react";

const AlphabetIndex = ({ indexList }: { indexList: string[] }) => {
  const [currentAlphabet, setCurrentAlphabet] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const top = entry.target.getBoundingClientRect().top;
        if (top < 130 && top > 0) {
          setCurrentAlphabet(String(entry.target.textContent));
        }
      });
    });

    const wrapEl = document.getElementById("alphabet-wrap");
    if (wrapEl) {
      const dividers = wrapEl.querySelectorAll(".my-alphabet");
      dividers.forEach((divider) => {
        observer.observe(divider);
      });
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="absolute right-3 top-36 flex flex-col items-center">
      {indexList.map((letter) => {
        return (
          <span
            className={clsx("my-0.5 cursor-pointer text-xs text-[#8E9AB0]", {
              "!text-[#0289FAFF]": currentAlphabet === letter,
            })}
            key={letter}
            onClick={() => {
              const el = document.getElementById(`letter${letter}`);
              el?.scrollIntoView({ block: "start", behavior: "smooth" });
              setCurrentAlphabet(letter);
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};

export default memo(AlphabetIndex);
