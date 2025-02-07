import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  BORDER_RADIUS,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
} from "@/features/editor/constants";
import { isRectType } from "../utils";

interface StrokeWidthSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const StrokeWidthSidebar = ({
  activeTool,
  editor,
  onChangeActiveTool,
}: StrokeWidthSidebarProps) => {
  const strokeDashArray =
    editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;
  const borderRadius =
    editor?.getActiveBorderRadius() === undefined
      ? BORDER_RADIUS
      : editor.getActiveBorderRadius();

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeStrokeWidth = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onChangeStrokeType = (value: number[]) => {
    editor?.changeStrokeDashArray(value);
  };

  const onChangeBorderRadius = (value: number) => {
    editor?.changeBorderRadius(value);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "stroke-width" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Border options"
        description="Modify the border of your element"
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Border width</Label>
          <Slider
            value={[editor?.getActiveStrokeWidth() || STROKE_WIDTH]}
            max={100}
            step={1}
            onValueChange={(values) => onChangeStrokeWidth(values[0])}
          />
        </div>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Border style</Label>
          <Button
            onClick={() => onChangeStrokeType([])}
            variant="secondary"
            size="lg"
            className={cn(
              "w-full h-[16px] justify-start text-left px-2 py-4",
              JSON.stringify(strokeDashArray) === "[]" &&
                "border border-blue-500"
            )}
          >
            <div className="w-full border-black rounded-full border-4" />
          </Button>
          <Button
            onClick={() => onChangeStrokeType([5, 5])}
            variant="secondary"
            size="lg"
            className={cn(
              "w-full h-[16px] justify-start text-left px-2 py-4",
              JSON.stringify(strokeDashArray) === "[5,5]" &&
                "border border-blue-500"
            )}
          >
            <div className="w-full border-black rounded-full border-4 border-dashed" />
          </Button>
        </div>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Border radius</Label>
          <Slider
            value={[borderRadius]}
            max={100}
            min={0}
            step={1}
            onValueChange={(values) => onChangeBorderRadius(values[0])}
            disabled={
              editor?.selectedObjects &&
              (editor.selectedObjects.length > 1 ||
                !isRectType(editor.selectedObjects[0]?.type))
            }
            className="data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { StrokeWidthSidebar };
