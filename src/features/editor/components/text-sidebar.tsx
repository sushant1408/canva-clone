import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface TextSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const TextSidebar = ({
  activeTool,
  editor,
  onChangeActiveTool,
}: TextSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "text" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Text" description="Add text to your canvas" />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Button onClick={() => editor?.addText("Textbox")} className="w-full">
            Add a textbox
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText("Heading", { fontSize: 80, fontWeight: 700 })
            }
            className="w-full h-16"
          >
            <span className="text-2xl font-bold">Add a heading</span>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText("Subheading", { fontSize: 44, fontWeight: 600 })
            }
            className="w-full h-16"
          >
            <span className="text-xl font-semibold">Add a subheading</span>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText("Paragraph", { fontSize: 32, fontWeight: 500 })
            }
            className="w-full h-16"
          >
            Paragraph
          </Button>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { TextSidebar };
