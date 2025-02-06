import { useCallback, useMemo, useState } from "react";
import * as fabric from "fabric";

import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  Editor,
  FILL_COLOR,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_WIDTH,
  TRIANGLE_OPTIONS,
} from "@/features/editor/types";
import { useAutoResize } from "./use-auto-resize";
import { useCanvasEvents } from "./use-canvas-events";
import { isTextType } from "../utils";

const buildEditor = ({
  canvas,
  fillColor,
  strokeColor,
  strokeWidth,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
}: BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas.getObjects().find((object) => object.name === "workspace");
  };

  const center = (object: fabric.FabricObject) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    canvas._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.FabricObject) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        // text types don't have stroke, so we're updating fill
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }

        object.set({ strokeColor: value });
      });
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
    },
    addCircle: () => {
      const object = new fabric.Circle({ ...CIRCLE_OPTIONS });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({ ...RECTANGLE_OPTIONS, rx: 50, ry: 50 });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({ ...RECTANGLE_OPTIONS });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({ ...TRIANGLE_OPTIONS });
      addToCanvas(object);
    },
    addInvertedTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        { ...TRIANGLE_OPTIONS }
      );
      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = RECTANGLE_OPTIONS.height;
      const WIDTH = RECTANGLE_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        { ...RECTANGLE_OPTIONS }
      );
      addToCanvas(object);
    },
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
  };
};

const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.FabricObject[]>(
    []
  );

  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);

  // to make the canvas and workspace responsive
  useAutoResize({ canvas, container });

  useCanvasEvents({ canvas, setSelectedObjects });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
      });
    }

    return undefined;
  }, [canvas, fillColor, strokeColor, strokeWidth]);

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      // object controls customization
      fabric.InteractiveFabricObject.ownDefaults = {
        ...fabric.InteractiveFabricObject.ownDefaults,
        cornerColor: "#fff",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      };

      // actual workspace/page
      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 1200,
        name: "workspace",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0, 0, 0, 0.8)",
          blur: 5,
        }),
      });

      // to make the height and width of the canvas that of the parent container
      initialCanvas.setDimensions({
        width: initialContainer.offsetWidth,
        height: initialContainer.offsetHeight,
      });

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);

      // to hide the objects going outside the workspace
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    []
  );

  return { init, editor };
};

export { useEditor };
