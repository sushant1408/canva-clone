import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LayersSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const LayersSidebar = ({
  activeTool,
  editor,
  onChangeActiveTool,
}: LayersSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const layers = editor?.canvas.getObjects();

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "layers" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Layers"
        description="Manage layers on your canvas"
      />
      <ScrollArea>
        <div className="p-4"></div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { LayersSidebar };
