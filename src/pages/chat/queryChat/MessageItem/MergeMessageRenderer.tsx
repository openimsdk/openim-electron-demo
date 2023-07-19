import { FC } from "react";

import { IMessageItemProps } from ".";

const MergeMessageRenderer: FC<IMessageItemProps> = ({ message }) => {
  return (
    <div className="w-60 cursor-pointer rounded-md border border-[var(--gap-text)]">
      <div className="border-b border-[var(--gap-text)] px-4 py-2.5">
        {message.mergeElem.title}
      </div>
      <ul className="px-4 py-2.5 text-xs text-[var(--sub-text)]">
        {message.mergeElem.abstractList.map((item, idx) => (
          <li className="mb-2 last:mb-0" key={idx}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MergeMessageRenderer;
