import deepEqual from "fast-deep-equal";
import * as PropTypes from "prop-types";
import * as React from "react";

import { formatEmoji } from "@/utils/emojis";

import styles from "./editable-div.module.scss";

function normalizeHtml(str: string): string {
  return str && str.replace(/&nbsp;|\u202F|\u00A0/g, " ");
}

function replaceCaret(el: HTMLElement) {
  // Place the caret at the end of the element
  const target = document.createTextNode("");
  el.appendChild(target);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    const sel = window.getSelection();
    if (sel !== null) {
      const range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (el instanceof HTMLElement) el.focus();
  }
}

export function insertAtCursor(nodes: Node[], rangeIdx = 0) {
  const selection = window.getSelection();
  const range = selection!.getRangeAt(rangeIdx);
  range.deleteContents();
  nodes.map((node) => {
    range.insertNode(node);
    range.setStartAfter(node);
  });
  range.setEndAfter(nodes[nodes.length - 1]);
  selection!.removeAllRanges();
  selection!.addRange(range);

  // Move the inserted nodes to the input element if they are not already there
  const inputElement = document.getElementById("editable-div");
  nodes.forEach((node) => {
    let parent = node.parentElement;
    while (parent) {
      if (parent === inputElement) return;
      parent = parent.parentElement;
    }
    inputElement?.appendChild(node);
  });

  return range;
}

/**
 * A simple component for an html element with editable contents.
 */
export default class EditableDiv extends React.Component<Props> {
  lastHtml: string = this.props.html;
  el: any =
    typeof this.props.innerRef === "function"
      ? { current: null }
      : React.createRef<HTMLElement>();

  getEl = () =>
    (this.props.innerRef && typeof this.props.innerRef !== "function"
      ? this.props.innerRef
      : this.el
    ).current as HTMLDivElement;

  render() {
    const { tagName, html, innerRef, ...props } = this.props;

    return React.createElement(
      tagName || "div",
      {
        ...props,
        ref:
          typeof innerRef === "function"
            ? (current: HTMLElement) => {
                innerRef(current);
                this.el.current = current;
              }
            : innerRef || this.el,
        onInput: this.emitChange,
        onBlur: this.props.onBlur || this.emitChange,
        onKeyUp: this.props.onKeyUp || this.emitChange,
        onKeyDown: this.props.onKeyDown || this.emitChange,
        onPaste: this.props.onPaste || this.pasteLint,
        contentEditable: !this.props.limit,
        dangerouslySetInnerHTML: { __html: html },
        className: `${styles.input} ${this.props.className}`,
      },
      this.props.children,
    );
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    const { props } = this;
    const el = this.getEl();

    // We need not rerender if the change of props simply reflects the user's edits.
    // Rerendering in this case would make the cursor/caret jump

    // Rerender if there is no element yet... (somehow?)
    if (!el) return true;

    // ...or if html really changed... (programmatically, not by user edit)
    if (normalizeHtml(nextProps.html) !== normalizeHtml(el.innerHTML)) {
      return true;
    }

    // Handle additional properties
    return (
      props.limit !== nextProps.limit ||
      props.tagName !== nextProps.tagName ||
      props.className !== nextProps.className ||
      props.innerRef !== nextProps.innerRef ||
      props.placeholder !== nextProps.placeholder ||
      !deepEqual(props.style, nextProps.style)
    );
  }

  componentDidUpdate() {
    const el = this.getEl();
    if (!el) return;

    // Perhaps React (whose VDOM gets outdated because we often prevent
    // rerendering) did not update the DOM. So we update it manually now.
    if (this.props.html !== el.innerHTML) {
      el.innerHTML = this.props.html;
    }
    this.lastHtml = this.props.html;
    replaceCaret(el);
  }

  deleteBeforeAt = () => {
    const el = this.getEl();
    if (!el) return;

    const selection = window.getSelection();
    if (!selection?.isCollapsed) return;

    const range = document.createRange();
    const anchorNode = selection.anchorNode;
    if (!anchorNode || !(anchorNode instanceof Text)) return;

    const text = anchorNode.textContent!;
    const offset = selection.anchorOffset;
    const lastIndex = text.lastIndexOf("@", offset - 1);
    // if (index === -1) return;
    // const lastIndex = text.lastIndexOf("@", index - 1);
    if (lastIndex !== -1) {
      range.setStart(anchorNode, lastIndex);
    } else {
      range.setStart(anchorNode, 0);
    }
    range.setEnd(anchorNode, offset);
    range.deleteContents();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  pasteLint = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const clp = e.clipboardData;
    e.preventDefault();

    if (clp?.items[0].type.includes("text/html")) {
      let text = clp.getData("text/html") || "";
      const imgMeta = "<meta charset='utf-8'>";
      if (text.includes(imgMeta)) {
        text = text.replaceAll(imgMeta, "");
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const nodes = Array.from(doc.body.childNodes);
        insertAtCursor(nodes);
      } else {
        text = text.replace(/<\/?[^>]+(>|$)/g, "");
        insertAtCursor([document.createTextNode(text)]);
      }
    }

    if (clp?.items[0].type.includes("text/plain")) {
      const text = clp.getData("text/plain") || "";
      const parser = new DOMParser();
      const doc = parser.parseFromString(formatEmoji(text), "text/html");
      const nodes = Array.from(doc.body.childNodes);
      insertAtCursor(nodes);
    }

    const images = [] as HTMLImageElement[];
    const imageItems = [...clp.items].filter((item: any) =>
      item.type.includes("image"),
    );
    imageItems.map((item: DataTransferItem) => {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;
        images.push(image);
        if (images.length === imageItems.length) {
          insertAtCursor([...images]);
        }
      };
      reader.readAsDataURL(blob!);
    });
  };

  emitChange = (originalEvt: React.SyntheticEvent<any>) => {
    const el = this.getEl();
    if (!el) return;

    const html = el.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      const evt = Object.assign({}, originalEvt, {
        target: {
          value: html,
        },
      });
      this.props.onChange(evt);
    }
    this.lastHtml = html;
  };

  static propTypes = {
    html: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    limit: PropTypes.string,
    tagName: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  };
}

export type EditableDivEvent = React.SyntheticEvent<any, Event> & {
  target: { value: string };
};
type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
type DivProps = Modify<
  JSX.IntrinsicElements["div"],
  { onChange: (event: EditableDivEvent) => void }
>;

export interface Props extends DivProps {
  html: string;
  limit?: string;
  tagName?: string;
  className?: string;
  style?: React.CSSProperties;
  innerRef?: React.RefObject<HTMLElement> | ((instance: HTMLElement) => void);
}
