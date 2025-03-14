export const replaceEmoji2Str = (text: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");

  const emojiEls: HTMLImageElement[] = Array.from(doc.querySelectorAll(".emojione"));
  emojiEls.map((face) => {
    // @ts-ignore
    const escapedOut = face.outerHTML.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    text = text.replace(new RegExp(escapedOut, "g"), face.alt);
  });
  return text;
};

export const getCleanText = (html: string) => {
  let text = replaceEmoji2Str(html);
  text = text.replace(/<\/p><p>/g, "\n");
  text = text.replace(/<br\s*[/]?>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");
  text = convertChar(text);
  text = decodeHtmlEntities(text);
  return text.trim();
};

let textAreaDom: HTMLTextAreaElement | null = null;
const decodeHtmlEntities = (text: string) => {
  if (!textAreaDom) {
    textAreaDom = document.createElement("textarea");
  }
  textAreaDom.innerHTML = text;
  return textAreaDom.value;
};

export const convertChar = (text: string) => text.replace(/&nbsp;/gi, " ");

export const getCleanTextExceptImg = (html: string) => {
  html = replaceEmoji2Str(html);

  const regP = /<\/p><p>/g;
  html = html.replace(regP, "</p><br><p>");

  const regBr = /<br\s*\/?>/gi;
  html = html.replace(regBr, "\n");

  const regWithoutHtmlExceptImg = /<(?!img\s*\/?)[^>]+>/gi;
  return html.replace(regWithoutHtmlExceptImg, "");
};
