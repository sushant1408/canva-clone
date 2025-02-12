import { FormEvent } from "react";
import { AlertTriangleIcon, LoaderIcon } from "lucide-react";
import * as fabric from "fabric";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { Button } from "@/components/ui/button";
import { useRemoveBackground } from "@/features/ai/api/use-remove-background";

interface RemoveBgSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const RemoveBgSidebar = ({
  activeTool,
  editor,
  onChangeActiveTool,
}: RemoveBgSidebarProps) => {
  const paywall = usePaywall();
  const { mutate, isPending } = useRemoveBackground();

  const selectedObject = editor?.selectedObjects[0] as fabric.FabricImage;
  const imageSrc = selectedObject?.getSrc();

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onSubmit = () => {
    if (paywall.shouldBlock) {
      paywall.triggerPaywall();
      return;
    }

    mutate(
      { image: imageSrc },
      {
        onSuccess: ({ data }) => {
          editor?.addImage(data);
        },
      }
    );
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "remove-bg" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Background removal"
        description="Remove background from image using AI"
      />
      {!imageSrc && (
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <AlertTriangleIcon className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            Feature not available for this object
          </p>
        </div>
      )}
      {imageSrc && (
        <ScrollArea>
          <div className="p-4 space-y-4">
            <div
              className={cn(
                "relative aspect-square rounded-md overflow-hidden transition bg-muted",
                isPending && "opacity-50"
              )}
            >
              <Image src={imageSrc} fill alt="image" className="object-cover" />
            </div>
            <Button onClick={onSubmit} className="w-full">
              {isPending ? (
                <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
              ) : (
                "Remove background"
              )}
            </Button>
          </div>
        </ScrollArea>
      )}
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { RemoveBgSidebar };
