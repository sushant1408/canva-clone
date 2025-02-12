import * as fabric from "fabric";
import { useEvent } from "react-use";

import { isTextType } from "../utils";

interface UseHotkeysProps {
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (skip?: boolean) => void;
  copy: () => Promise<{ activeObj: any; clonedObj: any }>;
  cut: () => void;
  paste: () => void;
}

const useHotkeys = ({
  canvas,
  copy,
  cut,
  paste,
  redo,
  save,
  undo,
}: UseHotkeysProps) => {
  useEvent("keydown", async (event) => {
    const isCtrlKey = event.ctrlKey || event.metaKey;
    const isBackspace = event.key === "Backspace";
    const isInput = ["INPUT", "TEXTAREA"].includes(
      (event.target as HTMLInputElement).tagName
    );

    if (isInput) {
      return;
    }

    if (isBackspace) {
      canvas?.remove(...canvas.getActiveObjects());
      canvas?.discardActiveObject();
    }

    if (isCtrlKey && event.key === "z") {
      event.preventDefault();
      undo();
    }

    if (isCtrlKey && event.key === "y") {
      event.preventDefault();
      redo();
    }

    if (isCtrlKey && event.key === "c") {
      event.preventDefault();
      await copy();
    }

    if (isCtrlKey && event.key === "v") {
      event.preventDefault();
      paste();
    }

    if (isCtrlKey && event.key === "d") {
      event.preventDefault();
      await copy();
      paste();
    }

    if (isCtrlKey && event.key === "x") {
      event.preventDefault();
      cut();
    }

    if (isCtrlKey && event.key === "s") {
      event.preventDefault();
      save(true);
    }

    if (isCtrlKey && event.key === "a") {
      event.preventDefault();
      canvas?.discardActiveObject();
      const allObjects = canvas
        ?.getObjects()
        .filter((object) => object.selectable);
      canvas?.setActiveObject(
        new fabric.ActiveSelection(allObjects, { canvas })
      );
      canvas?.renderAll();
    }

    if (isCtrlKey && event.key === "b") {
      event.preventDefault();
      canvas?.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          const currentFontWeight = object.get("fontWeight");

          object.set({ fontWeight: currentFontWeight > 500 ? 500 : 700 });
        }
      });
      canvas?.renderAll();
      canvas?.fire("object:modified");
    }

    if (isCtrlKey && event.key === "i") {
      event.preventDefault();
      canvas?.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          const currentFontStyle = object.get("fontStyle");

          object.set({
            fontWeight: currentFontStyle === "normal" ? "italic" : "normal",
          });
        }
      });
      canvas?.renderAll();
      canvas?.fire("object:modified");
    }

    if (isCtrlKey && event.key === "u") {
      event.preventDefault();
      canvas?.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          const currentUnderline = object.get("underline");

          object.set({
            underline: !currentUnderline,
          });
        }
      });
      canvas?.renderAll();
      canvas?.fire("object:modified");
    }
  });
};

export { useHotkeys };
