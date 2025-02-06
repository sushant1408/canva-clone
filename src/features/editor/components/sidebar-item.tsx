import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const SidebarItem = ({
  icon: Icon,
  label,
  onClick,
  isActive,
}: SidebarItemProps) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        "h-full w-full aspect-video p-3 py-4 flex flex-col rounded-none",
        isActive && "bg-muted text-primary"
      )}
    >
      <Icon className="size-5 stroke-2 shrink-0" />
      <span className="mt-2 text-xs">{label}</span>
    </Button>
  );
};

export { SidebarItem };
