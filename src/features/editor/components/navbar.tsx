import {
  ChevronDownIcon,
  DownloadIcon,
  MousePointerClickIcon,
  Redo2Icon,
  Undo2Icon,
} from "lucide-react";
import { CiFileOn } from "react-icons/ci";
import {
  BsCloudCheck,
  BsFiletypeJson,
  BsFiletypePng,
  BsFiletypeJpg,
  BsFiletypeSvg,
} from "react-icons/bs";
import { useFilePicker } from "use-file-picker";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/features/editor/components/logo";
import { Separator } from "@/components/ui/separator";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { ActiveTool, Editor } from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { UserButton } from "@/features/auth/components/user-button";

interface NavbarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const Navbar = ({ activeTool, editor, onChangeActiveTool }: NavbarProps) => {
  const { openFilePicker } = useFilePicker({
    accept: ".json",
    multiple: false,
    onFilesSuccessfullySelected: ({ plainFiles, filesContent }) => {
      console.log("onFilesSuccessfullySelected", plainFiles, filesContent);
      editor?.loadFromJson(filesContent[0]?.content);
    },
  });

  return (
    <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
      <Logo />

      <div className="w-full flex items-center gap-x-1 h-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              File
              <ChevronDownIcon className="size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuItem
              onClick={openFilePicker}
              className="flex items-center gap-x-2"
            >
              <CiFileOn className="!size-8" />
              <div>
                <p>Open</p>
                <p className="text-xs text-muted-foreground">
                  Open a JSON file
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-2" />
        <TooltipWrapper label="Select" side="bottom" sideOffset={10}>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onChangeActiveTool("select")}
            className={cn(activeTool === "select" && "bg-gray-100")}
          >
            <MousePointerClickIcon />
          </Button>
        </TooltipWrapper>
        <TooltipWrapper label="Undo" side="bottom" sideOffset={10}>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => editor?.onUndo()}
            disabled={!editor?.canUndo()}
          >
            <Undo2Icon />
          </Button>
        </TooltipWrapper>
        <TooltipWrapper label="Redo" side="bottom" sideOffset={10}>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => editor?.onRedo()}
            disabled={!editor?.canRedo()}
          >
            <Redo2Icon />
          </Button>
        </TooltipWrapper>

        <Separator orientation="vertical" className="mx-2" />
        <div className="flex items-center gap-x-2">
          <BsCloudCheck className="size-[20px] text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Saved</p>
        </div>

        <div className="ml-auto flex items-center gap-x-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                Export
                <DownloadIcon className="size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-60">
              <DropdownMenuItem
                onClick={() => editor?.saveAsJson()}
                className="flex items-center gap-x-2"
              >
                <BsFiletypeJson className="!size-7" />
                <div>
                  <p>JSON</p>
                  <p className="text-xs text-muted-foreground">
                    Save for later editing
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor?.saveAsPng()}
                className="flex items-center gap-x-2"
              >
                <BsFiletypePng className="!size-7" />
                <div>
                  <p>PNG</p>
                  <p className="text-xs text-muted-foreground">
                    Best for sharing on the web
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor?.saveAsJpeg()}
                className="flex items-center gap-x-2"
              >
                <BsFiletypeJpg className="!size-7" />
                <div>
                  <p>JPG</p>
                  <p className="text-xs text-muted-foreground">
                    Best for printing
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor?.saveAsSvg()}
                className="flex items-center gap-x-2"
              >
                <BsFiletypeSvg className="!size-7" />
                <div>
                  <p>SVG</p>
                  <p className="text-xs text-muted-foreground">
                    Best for editing in vector software
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <UserButton />
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
