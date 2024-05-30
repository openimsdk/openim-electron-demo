import React, { ReactNode, useEffect, useRef } from "react";
import twemoji from "twemoji";

interface TwemojiOptions {
  className?: string;
  size?: number;
}

interface TwemojiProps {
  children: ReactNode;
  options?: TwemojiOptions;
  tag?: string;
  dbSelectAll?: boolean;
  [key: string]: unknown;
}

const baseOptions = {
  className: "emojione",
  base: `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/`,
};

const Twemoji: React.FC<TwemojiProps> = (props) => {
  const { children, tag, dbSelectAll, options = {}, ...rest } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const childrenRefs = useRef<{ [key: string]: React.RefObject<HTMLElement> }>({});

  const noWrapper = !tag;

  const parseTwemoji = () => {
    if (noWrapper) {
      for (const i in childrenRefs.current) {
        const node = childrenRefs.current[i].current!;
        twemoji.parse(node, { ...baseOptions, ...options });
      }
    } else {
      const node = rootRef.current!;
      twemoji.parse(node, { ...baseOptions, ...options });
    }
  };

  useEffect(() => {
    parseTwemoji();
  }, []);

  if (noWrapper) {
    return (
      <>
        {React.Children.map(children, (child, index) => {
          if (typeof child === "string") {
            console.warn(
              `Twemoji can't parse string child when noWrapper is set. Skipping child "${child}"`,
            );
            return child;
          }
          childrenRefs.current[index] =
            childrenRefs.current[index] || React.createRef<HTMLElement>();
          return React.cloneElement(child as JSX.Element, {
            ref: childrenRefs.current[index],
            onDoubleClick: () => {
              if (!dbSelectAll) return;
              const range = document.createRange();
              range.selectNodeContents(childrenRefs.current[index].current!);
              const selection = window.getSelection();
              if (!selection) return;
              selection.removeAllRanges();
              selection.addRange(range);
            },
          });
        })}
      </>
    );
  }

  return React.createElement(tag ?? "div", { ref: rootRef, ...rest }, children);
};

export default Twemoji;

const regex = /<img[^>]*class="emojione"[^>]*alt="([^"]*)"[^>]*>/g;

export const parseTwemoji = (unicode: string) => {
  const div = document.createElement("div");
  div.textContent = unicode.replace(regex, (_, alt: string) => alt);
  document.body.appendChild(div);
  twemoji.parse(document.body, baseOptions);
  setTimeout(() => document.body.removeChild(div));

  return unescapeHTMLTags(div.innerHTML);
};

function unescapeHTMLTags(str: string) {
  return (
    str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      // remove style
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      // for windows clipboard data style
      .replace(/<html>(\r?\n)<body>(\r?\n)/g, "")
      .replace(/(\r?\n)<\/body>(\r?\n)<\/html>/g, "")
  );
}
