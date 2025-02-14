import Image from "next/image";
import * as fabric from "fabric";

import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { isImageType, isTextType } from "../utils";
import { SearchIcon } from "lucide-react";

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

  const layers = editor?.canvas
    .getObjects()
    // @ts-expect-error
    ?.filter((object) => object?.name !== "workspace");
  const activeObject = editor?.canvas.getActiveObject();

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
      {!layers || layers.length === 0 ? (
        <div className="flex items-center justify-center flex-1 flex-col gap-y-4">
          <SearchIcon className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground text-xs text-center">
            <p>No layers found.</p> <p>Add some elements and come back here</p>
          </span>
        </div>
      ) : null}
      <ScrollArea>
        <div className="p-4 space-y-4">
          {layers?.reverse()?.map((layer, index, thisArray) => {
            const foundLayer = thisArray?.find((obj) => obj === activeObject);
            const textLayer = isTextType(layer.type)
              ? (layer as fabric.FabricText)
              : null;
            const hasUnderline = textLayer?.underline;
            const hasLinethrough = textLayer?.linethrough;

            const imageLayer = isImageType(layer.type)
              ? (layer as fabric.FabricImage)
              : null;

            const circleLayer = layer?.type === "circle";
            const triangleLayer = layer?.type === "triangle";
            const rectLayer = layer?.type === "rect";

            return (
              <Button
                key={index}
                variant="secondary"
                size="lg"
                onClick={() => {
                  editor?.canvas.setActiveObject(layer);
                  editor?.canvas.renderAll();
                }}
                className={cn(
                  "py-2 px-4 w-full h-16 border-2 border-transparent hover:border-border relative",
                  foundLayer === layer && "border-2 border-blue-500"
                )}
              >
                {textLayer && (
                  <span
                    className="max-w-[240px] truncate"
                    style={{
                      fontWeight: textLayer?.fontWeight,
                      fontStyle: textLayer?.fontStyle,
                      fontFamily: textLayer?.fontFamily,
                      color: textLayer?.fill as string,
                      textDecoration: `${hasUnderline ? "underline" : ""} ${
                        hasLinethrough ? "line-through" : ""
                      }`,
                      transform: `rotate(${layer?.angle}deg)`,
                    }}
                  >
                    {(layer as fabric.FabricText).text}
                  </span>
                )}

                {imageLayer && (
                  <Image
                    src={(layer as fabric.FabricImage).getSrc()}
                    height={36}
                    width={36}
                    alt="Image"
                    style={{
                      transform: `rotate(${layer?.angle}deg)`,
                    }}
                  />
                )}

                {circleLayer && (
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{
                      backgroundColor: layer?.fill as string,
                      borderWidth: `${layer?.strokeWidth * 0.1}px`,
                      borderColor: layer?.stroke as string,
                    }}
                  />
                )}

                {rectLayer && (
                  <div
                    className="h-8 w-8"
                    style={{
                      borderRadius: `${(layer as fabric.Rect)?.rx * 0.1}px`,
                      backgroundColor: layer?.fill as string,
                      borderWidth: `${layer?.strokeWidth * 0.1}px`,
                      borderColor: layer?.stroke as string,
                      transform: `rotate(${layer?.angle}deg)`,
                    }}
                  />
                )}

                {triangleLayer && (
                  <div
                    className="h-0 w-0 border-x-[1rem] border-x-transparent border-b-[2rem]"
                    style={{
                      borderBottomColor: layer?.fill as string,
                      transform: `rotate(${layer?.angle}deg)`,
                    }}
                  />
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { LayersSidebar };
