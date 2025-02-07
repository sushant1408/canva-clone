import { useCallback, useMemo, useState } from "react";
import * as fabric from "fabric";

import {
  AlignElementTool,
  BuildEditorProps,
  Editor,
} from "@/features/editor/types";
import { useAutoResize } from "./use-auto-resize";
import { useCanvasEvents } from "./use-canvas-events";
import { isRectType, isTextType } from "../utils";
import {
  BORDER_RADIUS,
  CIRCLE_OPTIONS,
  FILL_COLOR,
  OPACITY,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TRIANGLE_OPTIONS,
} from "@/features/editor/constants";

const buildEditor = ({
  canvas,
  fillColor,
  strokeColor,
  strokeWidth,
  strokeDashArray,
  opacity,
  borderRadius,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  setStrokeDashArray,
  setOpacity,
  setBorderRadius,
  selectedObjects,
}: BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas.getObjects().find((object) => object.name === "workspace");
  };

  const center = (object: fabric.FabricObject) => {
    const workspace = getWorkspace();

    if (!workspace) {
      return;
    }

    const center = workspace.getCenterPoint();
    canvas._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.FabricObject) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  const alignToWorkspace = (value: AlignElementTool) => {
    const workspace = getWorkspace();

    if (!workspace) {
      return;
    }

    switch (value) {
      case "bottom":
        canvas.getActiveObjects().forEach((object) => {
          object.set({
            top:
              workspace.top + workspace.height - object.height * object.scaleY,
          });
          object.setCoords();
        });
        break;
      case "center":
        canvas.getActiveObjects().forEach((object) => {
          object.set({
            left:
              workspace.left +
              (workspace.width - object.width * object.scaleX) / 2,
          });
          object.setCoords();
        });
        break;
      case "left":
        canvas.getActiveObjects().forEach((object) => {
          object.set({
            left: workspace.left,
          });
          object.setCoords();
        });
        break;
      case "middle":
        canvas.getActiveObjects().forEach((object) => {
          object.set({
            top:
              workspace.top +
              (workspace.height - object.height * object.scaleY) / 2,
          });
          object.setCoords();
        });
        break;
      case "right":
        canvas.getActiveObjects().forEach((object) => {
          object.set({
            left:
              workspace.left + workspace.width - object.width * object.scaleX,
          });
          object.setCoords();
        });
        break;
      case "top":
        canvas.getActiveObjects().forEach((object) => {
          object.set({
            top: workspace.top,
          });
          object.setCoords();
        });
        break;
      default:
        break;
    }

    canvas.renderAll();
  };

  const alignToGroupBounds = (value: AlignElementTool) => {
    const selection = canvas.getActiveObject();

    // Get the bounding box of the selection
    const groupBounds = selection.getBoundingRect();
    console.log({ selection, groupBounds });

    switch (value) {
      case "bottom":
        break;
      case "center":
        break;
      case "left":
        break;
      case "middle":
        break;
      case "right":
        break;
      case "top":
        break;
      default:
        break;
    }

    canvas.renderAll();
  };

  return {
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringObjectForward(object);
      });

      // we're making sure that workspace will be the last object to prevent the other elements going behind it
      const workspace = getWorkspace();
      if (workspace) {
        canvas.sendObjectToBack(workspace);
      }

      canvas.renderAll();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendObjectBackwards(object);
      });

      // we're making sure that workspace will be the last object to prevent the other elements going behind it
      const workspace = getWorkspace();
      if (workspace) {
        canvas.sendObjectToBack(workspace);
      }

      canvas.renderAll();
    },
    bringToFront: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringObjectToFront(object);
      });

      // we're making sure that workspace will be the last object to prevent the other elements going behind it
      const workspace = getWorkspace();
      if (workspace) {
        canvas.sendObjectToBack(workspace);
      }

      canvas.renderAll();
    },
    sendToBack: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendObjectToBack(object);
      });

      // we're making sure that workspace will be the last object to prevent the other elements going behind it
      const workspace = getWorkspace();
      if (workspace) {
        canvas.sendObjectToBack(workspace);
      }

      canvas.renderAll();
    },
    changeAlignment: (value: AlignElementTool) => {
      if (selectedObjects.length === 1) {
        alignToWorkspace(value);
      } else if (selectedObjects.length > 1) {
        alignToGroupBounds(value);
      } else {
        return;
      }
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        // text types don't have stroke, so we're updating fill
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }

        object.set({ stroke: value });
      });
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
        object.setCoords();
      });
      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    changeOpacity: (value: number) => {
      setOpacity(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },
    changeBorderRadius: (value: number) => {
      setBorderRadius(value);
      canvas.getActiveObjects().forEach((object) => {
        if (!isRectType(object.type)) {
          return;
        }

        object.set({ rx: value, ry: value });
      });
      canvas.renderAll();
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
        strokeDashArray,
      });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
        strokeDashArray,
      });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
        strokeDashArray,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
        strokeDashArray,
      });
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
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
          strokeDashArray,
        }
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
        {
          ...RECTANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
          strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    addShape: (matrix) => {
      const object = new fabric.Polygon(matrix, {
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
        strokeDashArray,
      });
      addToCanvas(object);
    },
    canvas,
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fillColor;
      }

      return selectedObject.get("fill") || fillColor;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeColor;
      }

      return selectedObject.get("stroke") || strokeColor;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeWidth;
      }

      return selectedObject.get("strokeWidth") || strokeWidth;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeDashArray;
      }

      return selectedObject.get("strokeDashArray") || strokeDashArray;
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return opacity;
      }

      return selectedObject.get("opacity") || opacity;
    },
    getActiveBorderRadius: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return borderRadius;
      }

      return selectedObject.get("rx") || borderRadius;
    },
    selectedObjects,
  };
};

interface UseEditorProps {
  clearSelectionCallback?: () => void;
}

const useEditor = ({ clearSelectionCallback }: UseEditorProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.FabricObject[]>(
    []
  );

  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);
  const [opacity, setOpacity] = useState(OPACITY);
  const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS);

  // to make the canvas and workspace responsive
  useAutoResize({ canvas, container });

  useCanvasEvents({ canvas, setSelectedObjects, clearSelectionCallback });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        strokeColor,
        setFillColor,
        strokeWidth,
        strokeDashArray,
        opacity,
        borderRadius,
        setStrokeColor,
        setStrokeWidth,
        setStrokeDashArray,
        setOpacity,
        setBorderRadius,
        selectedObjects,
      });
    }

    return undefined;
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    strokeDashArray,
    opacity,
    selectedObjects,
  ]);

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
