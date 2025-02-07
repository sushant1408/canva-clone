import * as fabric from "fabric";

export type ActiveTool =
  | "select"
  | "shapes"
  | "text"
  | "images"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "settings"
  | "ai"
  | "remove-bg"
  | "templates"
  | "position";

export const selectionDependentTools: ActiveTool[] = [
  "fill",
  "filter",
  "font",
  "opacity",
  "remove-bg",
  "stroke-color",
  "stroke-width",
  "position",
];

export type AlignElementTool =
  | "top"
  | "left"
  | "middle"
  | "center"
  | "bottom"
  | "right";

export type BuildEditorProps = {
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray: number[];
  opacity: number;
  borderRadius: number;
  setFillColor: (value: string) => void;
  setStrokeColor: (value: string) => void;
  setStrokeWidth: (value: number) => void;
  setStrokeDashArray: (value: number[]) => void;
  setOpacity: (value: number) => void;
  setBorderRadius: (value: number) => void;
  selectedObjects: fabric.FabricObject[];
};

export interface Editor {
  bringForward: () => void;
  sendBackwards: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  changeAlignment: (value: AlignElementTool) => void;
  changeFillColor: (value: string) => void;
  changeStrokeColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  changeStrokeDashArray: (value: number[]) => void;
  changeOpacity: (value: number) => void;
  changeBorderRadius: (value: number) => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInvertedTriangle: () => void;
  addDiamond: () => void;
  addShape: (matrix: { x: number; y: number }[]) => void;
  canvas: fabric.Canvas;
  getActiveFillColor: () => string;
  getActiveStrokeColor: () => string;
  getActiveStrokeWidth: () => number;
  getActiveStrokeDashArray: () => number[];
  getActiveOpacity: () => number;
  getActiveBorderRadius: () => number;
  selectedObjects: fabric.FabricObject[];
}
