import * as fabric from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  canvas: fabric.Canvas | null;
  setSelectedObjects: (objects: fabric.FabricObject[]) => void;
  clearSelectionCallback?: () => void;
  save: () => void;
}

const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
  save,
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
      canvas.on("object:added", () => save());
      canvas.on("object:modified", () => save());
      canvas.on("object:removed", () => save());
      canvas.on("text:changed", () => save());
    }

    return () => {
      if (canvas) {
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
        canvas.off("object:added");
        canvas.off("object:modified");
        canvas.off("object:removed");
        canvas.off("text:changed");
      }
    };
  }, [canvas, clearSelectionCallback, save, setSelectedObjects]);
};

export { useCanvasEvents };
