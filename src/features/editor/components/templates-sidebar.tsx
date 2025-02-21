import {
  AlertTriangleIcon,
  CrownIcon,
  LoaderIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ActiveTool, Editor } from "@/features/editor/types";
import {
  ResponseType,
  useGetTemplates,
} from "@/features/projects/api/use-get-templates";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";

interface TemplatesSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const TemplatesSidebar = ({
  activeTool,
  editor,
  onChangeActiveTool,
}: TemplatesSidebarProps) => {
  const paywall = usePaywall();
  const { data, isLoading, isError } = useGetTemplates();
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "You are about to replace the current project with this template.",
  });

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClick = async (template: ResponseType["data"][0]) => {
    if (template.isPro && paywall.shouldBlock) {
      paywall.triggerPaywall();
      return;
    }

    const ok = await confirm();

    if (ok) {
      editor?.loadFromJson(template.json);
    }
  };

  if (isLoading) {
    return (
      <aside
        className={cn(
          "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
          activeTool === "templates" ? "visible" : "hidden"
        )}
      >
        <ToolSidebarHeader
          title="Templates"
          description="Choose from a variety of templates to get started"
        />
        <div className="flex items-center justify-center flex-1">
          <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
        </div>
        <ToolSidebarClose onClick={onClose} />
      </aside>
    );
  }

  if (isError) {
    return (
      <aside
        className={cn(
          "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
          activeTool === "templates" ? "visible" : "hidden"
        )}
      >
        <ToolSidebarHeader
          title="Templates"
          description="Choose from a variety of templates to get started"
        />
        <div className="flex items-center justify-center flex-1 flex-col gap-y-4">
          <AlertTriangleIcon className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            Failed to fetch templates
          </p>
        </div>
        <ToolSidebarClose onClick={onClose} />
      </aside>
    );
  }

  if (!data?.pages.length || !data?.pages[0].data.length) {
    return (
      <aside
        className={cn(
          "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
          activeTool === "templates" ? "visible" : "hidden"
        )}
      >
        <ToolSidebarHeader
          title="Templates"
          description="Choose from a variety of templates to get started"
        />
        <div className="flex items-center justify-center flex-1 flex-col gap-y-4">
          <SearchIcon className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">No templates found</p>
        </div>
        <ToolSidebarClose onClick={onClose} />
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "templates" ? "visible" : "hidden"
      )}
    >
      <ConfirmationDialog />
      <ToolSidebarHeader
        title="Templates"
        description="Choose from a variety of templates to get started"
      />
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {data.pages.map((group, i) => (
              <Fragment key={i}>
                {group.data.map((template) => (
                  <button
                    key={template.id}
                    className="relative w-full group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                    style={{
                      aspectRatio: `${template.width} / ${template.height}`,
                    }}
                    onClick={() => onClick(template)}
                  >
                    {template.isPro && (
                      <div className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center bg-black/50 rounded-full z-[10]">
                        <CrownIcon className="!size-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                    <Image
                      fill
                      src={template.thumbnailUrl || ""}
                      alt={template.name}
                      className="object-cover"
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50 text-left">
                      {template.name}
                    </div>
                  </button>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { TemplatesSidebar };
