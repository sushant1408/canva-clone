import {
  AlignCenterHorizontalIcon,
  AlignCenterVerticalIcon,
  AlignEndHorizontalIcon,
  AlignEndVerticalIcon,
  AlignStartHorizontalIcon,
  AlignStartVerticalIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BringToFrontIcon,
  SendToBackIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ActiveTool, Editor } from "@/features/editor/types";
import { cn } from "@/lib/utils";

interface PositionSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const PositionSidebar = ({
  activeTool,
  editor,
  onChangeActiveTool,
}: PositionSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "position" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Position"
        description="Update the position or alignment of your element"
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Arrange</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => editor?.bringForward()}>
              <ArrowUpIcon />
              Bring forward
            </Button>
            <Button variant="outline" onClick={() => editor?.sendBackwards()}>
              <ArrowDownIcon />
              Send backward
            </Button>
            <Button variant="outline" onClick={() => editor?.bringToFront()}>
              <BringToFrontIcon />
              Bring front
            </Button>
            <Button variant="outline" onClick={() => editor?.sendToBack()}>
              <SendToBackIcon />
              Send back
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Align to page</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => editor?.changeAlignment("top")}
            >
              <AlignStartHorizontalIcon />
              Top
            </Button>
            <Button
              variant="outline"
              onClick={() => editor?.changeAlignment("left")}
            >
              <AlignStartVerticalIcon />
              Left
            </Button>
            <Button
              variant="outline"
              onClick={() => editor?.changeAlignment("middle")}
            >
              <AlignCenterHorizontalIcon />
              Middle
            </Button>
            <Button
              variant="outline"
              onClick={() => editor?.changeAlignment("center")}
            >
              <AlignCenterVerticalIcon />
              Center
            </Button>
            <Button
              variant="outline"
              onClick={() => editor?.changeAlignment("bottom")}
            >
              <AlignEndHorizontalIcon />
              Bottom
            </Button>
            <Button
              variant="outline"
              onClick={() => editor?.changeAlignment("right")}
            >
              <AlignEndVerticalIcon />
              Right
            </Button>
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { PositionSidebar };
