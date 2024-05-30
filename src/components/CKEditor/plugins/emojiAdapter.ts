import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

import { parseTwemoji } from "@/components/Twemoji";
import { parseBr } from "@/utils/imCommon";

class EmojiAdapterPlugin extends Plugin {
  init() {
    const editor = this.editor;

    editor.conversion.for("upcast").elementToElement({
      view: {
        name: "img",
        classes: "emojione",
      },
      model: (viewElement, { writer: modelWriter }) => {
        return modelWriter.createElement("emoji", {
          src: viewElement.getAttribute("src"),
          alt: viewElement.getAttribute("alt"),
        });
      },
      converterPriority: "highest",
    });

    editor.conversion.for("downcast").elementToElement({
      model: "emoji",
      view: (modelElement, { writer: viewWriter }) => {
        return viewWriter.createEmptyElement("img", {
          class: "emojione",
          src: modelElement.getAttribute("src"),
          alt: modelElement.getAttribute("alt"),
        });
      },
    });

    editor.model.schema.register("emoji", {
      allowWhere: "$text",
      isInline: true,
      isObject: true,
      allowAttributes: ["src", "alt"],
    });

    const clipboard = editor.plugins.get("ClipboardPipeline");
    this.listenTo(clipboard, "inputTransformation", (evt, data) => {
      const clipboardData = data.dataTransfer;
      const htmlContent = clipboardData.getData("text/html");
      const text: string = htmlContent || clipboardData.getData("text/plain");
      if (!text) return;
      evt.stop();
      editor.model.change((writer) => {
        const selection = editor.model.document.selection;

        if (!selection.isCollapsed) {
          editor.model.deleteContent(selection);
        }

        const viewFragment = editor.data.processor.toView(parseBr(parseTwemoji(text)));
        const modelFragment = editor.data.toModel(viewFragment);
        const range = editor.model.insertContent(
          modelFragment,
          selection.getFirstPosition(),
        );
        // move cursor to the end of the pasted content
        if (range && !range.isCollapsed) {
          const endPosition = range.end;
          writer.setSelection(endPosition);
        }

        editor.editing.view.focus();
      });
    });
  }
}

export default EmojiAdapterPlugin;
