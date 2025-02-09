import { FormEvent, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./color-picker";
import { Separator } from "@/components/ui/separator";

interface SettingsSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const SettingsSidebar = ({
  activeTool,
  editor,
  onChangeActiveTool,
}: SettingsSidebarProps) => {
  const workspace = editor?.getWorkspace();

  const initialWidth = useMemo(() => `${workspace?.width || 0}`, [workspace]);
  const initialHeight = useMemo(() => `${workspace?.height || 0}`, [workspace]);
  const initialBackground = useMemo(
    () => workspace?.fill || "#FFFFFF",
    [workspace]
  );

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [background, setBackground] = useState(initialBackground);

  useEffect(() => {
    setWidth(initialWidth);
    setHeight(initialHeight);
    setBackground(initialBackground);
  }, [initialWidth, initialHeight, initialBackground]);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeWidth = (value: string) => setWidth(value);

  const onChangeHeight = (value: string) => setHeight(value);

  const onChangeBackground = (value: string) => {
    setBackground(value);
    editor?.changeWorkspaceBackground(value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    editor?.changeWorkspaceSize({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "settings" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Settings"
        description="Change the look of your workspace"
      />
      <ScrollArea>
        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Height</Label>
            <Input
              placeholder="Height"
              value={height}
              type="number"
              onChange={(e) => onChangeHeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Width</Label>
            <Input
              placeholder="Width"
              value={width}
              type="number"
              onChange={(e) => onChangeWidth(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Resize
          </Button>
        </form>
        <Separator />
        <div className="p-4">
          <ColorPicker
            value={background as string}
            onChange={onChangeBackground}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { SettingsSidebar };
