import Image from "next/image";
import * as fabric from "fabric";

import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { isImageType, isTextType } from "../utils";
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
  ClipboardIcon,
  CopyIcon,
  CopyPlusIcon,
  LayersIcon,
  LockIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SendToBackIcon,
  TrashIcon,
  UnlockIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    // @ts-expect-error object.name exists as custom key
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
              <div key={index} className="relative group">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    editor?.canvas.setActiveObject(layer);
                    editor?.canvas.renderAll();
                  }}
                  className={cn(
                    "py-2 px-4 w-full h-16 border-2 border-transparent hover:border-border",
                    foundLayer === layer && "border-2 border-blue-500"
                  )}
                  disabled={!layer?.selectable}
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
                      // @ts-expect-error layer._originalElement.currentSrc exists
                      src={layer?._originalElement?.currentSrc}
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

                {layer.selectable && (
                  <DropdownMenu
                    onOpenChange={(open) => {
                      if (open) {
                        editor?.canvas.setActiveObject(layer);
                        editor?.canvas.renderAll();
                      }
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => editor?.onCopy()}>
                        <CopyIcon />
                        Copy
                        <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => editor?.onPaste()}>
                        <ClipboardIcon />
                        Paste
                        <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          await editor?.onCopy();
                          editor?.onPaste();
                        }}
                      >
                        <CopyPlusIcon />
                        Duplicate
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => editor?.delete()}>
                        <TrashIcon />
                        Delete
                        <DropdownMenuShortcut>Del</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <LayersIcon />
                          Layer
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => editor?.bringForward()}
                            >
                              <ArrowUpIcon />
                              Bring forward
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => editor?.sendBackwards()}
                            >
                              <ArrowDownIcon />
                              Send backward
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => editor?.bringToFront()}
                            >
                              <BringToFrontIcon />
                              Bring front
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => editor?.sendToBack()}
                            >
                              <SendToBackIcon />
                              Send back
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <AlignStartVerticalIcon />
                          Align
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => editor?.changeAlignment("left")}
                            >
                              <AlignStartVerticalIcon />
                              Left
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => editor?.changeAlignment("center")}
                            >
                              <AlignCenterVerticalIcon />
                              Center
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => editor?.changeAlignment("right")}
                            >
                              <AlignEndVerticalIcon />
                              Right
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => editor?.changeAlignment("top")}
                            >
                              <AlignStartHorizontalIcon />
                              Top
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => editor?.changeAlignment("middle")}
                            >
                              <AlignCenterHorizontalIcon />
                              Middle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => editor?.changeAlignment("bottom")}
                            >
                              <AlignEndHorizontalIcon />
                              Bottom
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          editor?.changeSelectable(false);
                          editor?.canvas.discardActiveObject();
                          editor?.canvas.renderAll();
                        }}
                      >
                        <LockIcon />
                        Lock
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {!layer.selectable && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                    onClick={() => {
                      editor?.changeSelectable(true);
                      editor?.canvas.setActiveObject(layer);
                      editor?.canvas.renderAll();
                    }}
                  >
                    <UnlockIcon />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { LayersSidebar };
