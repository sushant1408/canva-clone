import { MinimizeIcon } from "lucide-react";
import { useState } from "react";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { workspaceZoomLevels } from "../constants";
import { Editor } from "../types";

interface FooterProps {
  editor: Editor | undefined;
}

const Footer = ({ editor }: FooterProps) => {
  const [value, setValue] = useState(100);

  const onChange = (value: number) => {
    setValue(value);

    const zoomFactor = value / 100;
    editor?.setZoom(zoomFactor);
  };

  return (
    <footer className="h-[52px] border-t bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-1 shrink-0 px-4 flex-row-reverse">
      <div className="flex items-center gap-x-2">
        <Slider
          value={[value]}
          onValueChange={(value) => onChange(value[0])}
          min={10}
          max={500}
          step={1}
          className="w-[180px]"
        />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-[74px]">
              {value}%
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {workspaceZoomLevels.map((level) => (
              <DropdownMenuCheckboxItem
                key={level}
                onClick={() => onChange(level)}
              >
                {level}%
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipWrapper label="Reset zoom" side="top" sideOffset={10}>
          <Button
            size="icon"
            variant="ghost"
            className="h-full"
            onClick={() => {
              editor?.autoZoom();
              setValue(100);
            }}
          >
            <MinimizeIcon className="size-4" />
          </Button>
        </TooltipWrapper>
      </div>
    </footer>
  );
};

export { Footer };
