import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface TooltipWrapper {
  align?: "center" | "start" | "end";
  alignOffset?: number;
  children: ReactNode;
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

const TooltipWrapper = ({
  align,
  alignOffset,
  children,
  label,
  side,
  sideOffset,
}: TooltipWrapper) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          className="text-white bg-slate-800 border-slate-800"
        >
          <p className="font-semibold capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { TooltipWrapper };
