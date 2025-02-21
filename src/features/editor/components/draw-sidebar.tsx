import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { STROKE_COLOR, STROKE_WIDTH } from "@/features/editor/constants";
import { ActiveTool, Editor } from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { ColorPicker } from "./color-picker";

interface DrawSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const DrawSidebar = ({
  activeTool,
  editor,
  onChangeActiveTool,
}: DrawSidebarProps) => {
  const onClose = () => {
    editor?.disableDrawingMode();
    onChangeActiveTool("select");
  };

  const onChangeBrushColor = (value: string) => {
    editor?.changeBrushColor(value);
  };

  const onChangeStrokeWidth = (value: number) => {
    editor?.changeBrushWidth(value);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "draw" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Brush options"
        description="Modify brush color, line width, etc."
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Line Width</Label>
          <Slider
            value={[editor?.getBrushWidth() || STROKE_WIDTH]}
            max={250}
            min={1}
            step={1}
            onValueChange={(values) => onChangeStrokeWidth(values[0])}
          />
        </div>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Brush color</Label>
          <ColorPicker
            value={editor?.getBrushColor() || STROKE_COLOR}
            onChange={onChangeBrushColor}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { DrawSidebar };
