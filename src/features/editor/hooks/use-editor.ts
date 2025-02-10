import { useCallback, useMemo, useRef, useState } from "react";
import * as fabric from "fabric";

import {
  AlignElementTool,
  BuildEditorProps,
  Editor,
} from "@/features/editor/types";
import { useAutoResize } from "./use-auto-resize";
import { useCanvasEvents } from "./use-canvas-events";
import {
  createFilter,
  downloadFile,
  isImageType,
  isRectType,
  isTextType,
  transformText,
} from "../utils";
import {
  BORDER_RADIUS,
  CIRCLE_OPTIONS,
  FILL_COLOR,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  JSON_KEYS,
  OPACITY,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXT_OPTIONS,
  TRIANGLE_OPTIONS,
} from "@/features/editor/constants";
import { useClipboard } from "./use-clipboard";
import { useHistory } from "./use-history";
import { useHotkeys } from "./use-hotkeys";
import { useWindowEvent } from "./use-window-event";
import { useLoadState } from "./use-load-state";

const buildEditor = ({
  canvas,
  fillColor,
  strokeColor,
  strokeWidth,
  strokeDashArray,
  opacity,
  borderRadius,
  fontFamily,
  brushColor,
  brushWidth,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  setStrokeDashArray,
  setOpacity,
  setBorderRadius,
  setFontFamily,
  setBrushColor,
  setBrushWidth,
  selectedObjects,
  copy,
  cut,
  paste,
  autoZoom,
  save,
  canRedo,
  canUndo,
  redo,
  undo,
}: BuildEditorProps): Editor => {
  const generateSaveOptions = () => {
    const { height, left, top, width } = getWorkspace() as fabric.Rect;

    return {
      name: "Image",
      format: "png" as fabric.ImageFormat,
      quality: 1,
      multiplier: 1,
      height,
      width,
      left,
      top,
    };
  };

  const saveAsPng = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);
    downloadFile(dataUrl, "png");
    autoZoom();
  };

  const saveAsSvg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);
    downloadFile(dataUrl, "svg");
    autoZoom();
  };

  const saveAsJpeg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);
    downloadFile(dataUrl, "jpeg");
    autoZoom();
  };

  const saveAsJson = async () => {
    const dataUrl = canvas.toDatalessJSON(JSON_KEYS);

    await transformText(dataUrl.objects);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, "\t")
    )}`;

    downloadFile(fileString, "json");
  };

  const loadFromJson = (json: string) => {
    const data = JSON.parse(json);

    canvas.loadFromJSON(data).then(() => {
      autoZoom();
    });
  };

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
    // download options
    saveAsJpeg,
    saveAsJson,
    saveAsPng,
    saveAsSvg,

    // load options
    loadFromJson,

    // canvas functionalities
    changeWorkspaceSize: (value) => {
      const workspace = getWorkspace();

      workspace?.set(value);
      autoZoom();
      save();
    },
    changeWorkspaceBackground: (value) => {
      const workspace = getWorkspace();

      workspace?.set({ fill: value });
      canvas.renderAll();
      save();
    },
    enableDrawingMode: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.freeDrawingBrush.color = strokeColor;
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
    },
    onCopy: () => copy(),
    onPaste: () => paste(),
    onCut: () => cut(),
    delete: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.remove(object);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    getWorkspace,
    autoZoom,
    setZoom: (value) => {
      let zoomRatio = value * 0.5;
      zoomRatio = Math.min(Math.max(zoomRatio, 0.1), 2.5);

      const center = canvas.getCenterPoint();
      canvas.zoomToPoint(new fabric.Point(center.x, center.y), zoomRatio);
    },

    // undo/redo functionality
    canRedo,
    onRedo: () => redo(),
    onUndo: () => undo(),
    canUndo,

    // layer modifications
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
    changeAlignment: (value) => {
      if (selectedObjects.length === 1) {
        alignToWorkspace(value);
      } else if (selectedObjects.length > 1) {
        alignToGroupBounds(value);
      } else {
        return;
      }
    },

    // modify elements
    changeFillColor: (value) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value) => {
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
    changeStrokeWidth: (value) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
        object.setCoords();
      });
      canvas.renderAll();
    },
    changeStrokeDashArray: (value) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    changeOpacity: (value) => {
      setOpacity(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },
    changeBorderRadius: (value) => {
      setBorderRadius(value);
      canvas.getActiveObjects().forEach((object) => {
        if (!isRectType(object.type)) {
          return;
        }

        object.set({ rx: value, ry: value });
      });
      canvas.renderAll();
    },
    changeFontFamily: (value) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    changeFontWeight: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    changeFontStyle: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    changeFontUnderline: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    changeFontStrikeThrough: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    changeTextAlignment: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    changeFontSize: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    changeImageFilter: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isImageType(object.type)) {
          const imageObject = object as fabric.FabricImage;
          imageObject.set({ cacheEnabled: false });
          canvas.renderAll();

          const effect = createFilter(value);

          imageObject.filters = effect ? [effect] : [];

          imageObject.applyFilters();
          canvas.renderAll();
        }
      });
    },
    changeBrushColor: (value) => {
      setBrushColor(value);
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = value;
      }
    },
    changeBrushWidth: (value) => {
      setBrushWidth(value);
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = value;
      }
    },
    changeSelectable: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ selectable: value });
      });
      canvas.discardActiveObject();
      canvas.renderAll();
    },

    // add elements
    addImage: async (value) => {
      const image = await fabric.FabricImage.fromURL(value, {
        crossOrigin: "anonymous",
      });

      if (!image) {
        return;
      }

      const workspace = getWorkspace();

      image.scaleToWidth(workspace?.width || 0);
      image.scaleToHeight(workspace?.height || 0);

      addToCanvas(image);
    },
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });
      addToCanvas(object);
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

    // get element properties
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
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fontFamily;
      }

      return selectedObject.get("fontFamily") || fontFamily;
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_WEIGHT;
      }

      return selectedObject.get("fontWeight") || FONT_WEIGHT;
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "normal";
      }

      return selectedObject.get("fontStyle") || "normal";
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      return selectedObject.get("underline") || false;
    },
    getActiveFontStrikethrough: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      return selectedObject.get("linethrough") || false;
    },
    getActiveTextAlignment: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "left";
      }

      return selectedObject.get("textAlign") || "left";
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_SIZE;
      }

      return selectedObject.get("fontSize") || FONT_SIZE;
    },
    getBrushColor: () => {
      return canvas.freeDrawingBrush?.color || brushColor;
    },
    getBrushWidth: () => {
      return canvas.freeDrawingBrush?.width || brushWidth;
    },
    getActiveSelectable: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return true;
      }

      return selectedObject.get("selectable") || true;
    },

    canvas,
    selectedObjects,
  };
};

interface UseEditorProps {
  defaultState: string;
  defaultWidth: number;
  defaultHeight: number;
  clearSelectionCallback?: () => void;
  saveCallback?: (values: {
    json: string;
    height: number;
    width: number;
  }) => void;
}

const useEditor = ({
  defaultHeight,
  defaultState,
  defaultWidth,
  clearSelectionCallback,
  saveCallback,
}: UseEditorProps) => {
  const initialState = useRef(defaultState);
  const initialWidth = useRef(defaultWidth);
  const initialHeight = useRef(defaultHeight);

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
  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [brushColor, setBrushColor] = useState(STROKE_COLOR);
  const [brushWidth, setBrushWidth] = useState(STROKE_WIDTH);

  useWindowEvent();

  const { canRedo, canUndo, canvasHistory, redo, save, setHistoryIndex, undo } =
    useHistory({ canvas, saveCallback });

  const { copy, cut, paste } = useClipboard({ canvas });

  // to make the canvas and workspace responsive
  const { autoZoom } = useAutoResize({ canvas, container });

  useCanvasEvents({ canvas, setSelectedObjects, clearSelectionCallback, save });

  useHotkeys({ canvas, copy, cut, paste, undo, redo, save });

  useLoadState({
    canvas,
    setHistoryIndex,
    autoZoom,
    initialState,
    canvasHistory,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        autoZoom,
        fillColor,
        strokeColor,
        setFillColor,
        strokeWidth,
        strokeDashArray,
        opacity,
        borderRadius,
        fontFamily,
        brushColor,
        brushWidth,
        setStrokeColor,
        setStrokeWidth,
        setStrokeDashArray,
        setOpacity,
        setBorderRadius,
        setFontFamily,
        setBrushColor,
        setBrushWidth,
        selectedObjects,
        copy,
        cut,
        paste,
        save,
        undo,
        redo,
        canUndo,
        canRedo,
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
    borderRadius,
    fontFamily,
    brushColor,
    brushWidth,
    selectedObjects,
    copy,
    cut,
    paste,
    autoZoom,
    save,
    undo,
    redo,
    canUndo,
    canRedo,
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
        width: initialWidth.current,
        height: initialHeight.current,
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

      // initial history stack
      const currentState = JSON.stringify(
        initialCanvas.toDatalessJSON(JSON_KEYS)
      );
      canvasHistory.current = [currentState];
      setHistoryIndex(0);
    },
    []
  );

  return { init, editor };
};

export { useEditor };
