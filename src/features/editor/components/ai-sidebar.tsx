import { FormEvent, useState } from "react";
import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGenerateImage } from "@/features/ai/api/use-generate-image";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

interface AiSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const AiSidebar = ({
  activeTool,
  editor,
  onChangeActiveTool,
}: AiSidebarProps) => {
  const paywall = usePaywall();
  const { mutate, isPending } = useGenerateImage();

  const [value, setValue] = useState("");

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paywall.shouldBlock) {
      paywall.triggerPaywall();
      return;
    }

    mutate(
      { prompt: value },
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
        activeTool === "ai" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="AI" description="Generate an image using AI" />
      <ScrollArea>
        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <Textarea
            placeholder="an astronaut riding a horse on mars, hd, dramatic lighting"
            cols={30}
            rows={10}
            required
            minLength={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        </form>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { AiSidebar };
