import * as fabric from "fabric";
import { useCallback, useRef } from "react";

interface UseClipboardProps {
  canvas: fabric.Canvas | null;
}

const useClipboard = ({ canvas }: UseClipboardProps) => {
  const clipboard = useRef<any>(null);

  const copy = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      canvas
        ?.getActiveObject()
        ?.clone()
        ?.then((cloned) => {
          clipboard.current = cloned;
          resolve();
        });
    });
  }, [canvas]);

  const paste = useCallback(async () => {
    if (!clipboard.current) {
      return;
    }

    const clonedObj = await clipboard.current.clone();
    // discard selection of copied object
    canvas?.discardActiveObject();

    // move new pasted object so they don't overlap
    clonedObj?.set({
      left: clonedObj?.left + 10,
      top: clonedObj?.top + 10,
      evented: true,
    });

    if (clonedObj?.type === "activeSelection") {
      clonedObj.canvas = canvas;
      clonedObj.forEachObject((obj: any) => {
        canvas?.add(obj);
      });
      clonedObj?.setCoords();
    } else {
      canvas?.add(clonedObj);
    }

    // move the object which is copied
    clipboard.current.left += 10;
    clipboard.current.top += 10;

    // select the new pasted object
    canvas?.setActiveObject(clonedObj);

    canvas?.requestRenderAll();
  }, [canvas]);

  return { copy, paste };
};

export { useClipboard };
