import * as fabric from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  canvas: fabric.Canvas | null;
  setSelectedObjects: (objects: fabric.FabricObject[]) => void;
  clearSelectionCallback?: () => void;
}

const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
  clearSelectionCallback
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (event) => {
        setSelectedObjects(event.selected);
      });
      canvas.on("selection:updated", (event) => {
        setSelectedObjects(event.selected);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObjects([]);
        clearSelectionCallback?.();
      });
    }

    return () => {
      if (canvas) {
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
      }
    };
  }, [canvas, clearSelectionCallback]);
};

export { useCanvasEvents };
