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

export type TextAlignment = "left" | "center" | "right" | "justify";

export type BuildEditorProps = {
  canvas: fabric.Canvas;
  autoZoom: () => void;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray: number[];
  opacity: number;
  borderRadius: number;
  fontFamily: string;
  brushColor: string;
  brushWidth: number;
  setFillColor: (value: string) => void;
  setStrokeColor: (value: string) => void;
  setStrokeWidth: (value: number) => void;
  setStrokeDashArray: (value: number[]) => void;
  setOpacity: (value: number) => void;
  setBorderRadius: (value: number) => void;
  setFontFamily: (value: string) => void;
  setBrushColor: (value: string) => void;
  setBrushWidth: (value: number) => void;
  selectedObjects: fabric.FabricObject[];
  copy: () => Promise<{ activeObj: any; clonedObj: any }>;
  cut: () => void;
  paste: () => void;
  canUndo: () => boolean;
  undo: () => void;
  canRedo: () => boolean;
  redo: () => void;
  save: (skip?: boolean) => void;
};

export interface Editor {
  canvas: fabric.Canvas;
  selectedObjects: fabric.FabricObject[];
  enableDrawingMode: () => void;
  disableDrawingMode: () => void;
  onCopy: () => Promise<{ activeObj: any; clonedObj: any }>;
  onCut: () => void;
  onPaste: () => void;
  delete: () => void;
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
  changeFontFamily: (value: string) => void;
  changeFontWeight: (value: number) => void;
  changeFontStyle: (value: string) => void;
  changeFontUnderline: (value: boolean) => void;
  changeFontStrikeThrough: (value: boolean) => void;
  changeTextAlignment: (value: TextAlignment) => void;
  changeFontSize: (value: number) => void;
  changeImageFilter: (value: string) => void;
  changeBrushColor: (value: string) => void;
  changeBrushWidth: (value: number) => void;
  addImage: (value: string) => void;
  addText: (value: string, options?: Partial<fabric.ITextProps>) => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInvertedTriangle: () => void;
  addDiamond: () => void;
  addShape: (matrix: { x: number; y: number }[]) => void;
  getActiveFillColor: () => string;
  getActiveStrokeColor: () => string;
  getActiveStrokeWidth: () => number;
  getActiveStrokeDashArray: () => number[];
  getActiveOpacity: () => number;
  getActiveBorderRadius: () => number;
  getActiveFontFamily: () => string;
  getActiveFontWeight: () => number;
  getActiveFontStyle: () => string;
  getActiveFontUnderline: () => boolean;
  getActiveFontStrikethrough: () => boolean;
  getActiveTextAlignment: () => TextAlignment;
  getActiveFontSize: () => number;
  getBrushColor: () => string;
  getBrushWidth: () => number;
  changeWorkspaceSize: (value: { height: number; width: number }) => void;
  changeWorkspaceBackground: (value: string) => void;
  getWorkspace: () => fabric.FabricObject | undefined;
  autoZoom: () => void;
  setZoom: (value: number) => void;
  canUndo: () => boolean;
  onUndo: () => void;
  canRedo: () => boolean;
  onRedo: () => void;
  saveAsJpeg: () => void;
  saveAsJson: () => void;
  saveAsPng: () => void;
  saveAsSvg: () => void;
  loadFromJson: (json: string) => void;
}
