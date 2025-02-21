import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { IconType } from "react-icons";

import { cn } from "@/lib/utils";

interface ShapeToolProps {
  onClick: () => void;
  icon?: LucideIcon | IconType;
  iconClassName?: string;
  image?: string;
  imageClassName?: string;
}

const ShapeTool = ({
  icon: Icon,
  iconClassName,
  image,
  imageClassName,
  onClick,
}: ShapeToolProps) => {
  return (
    <button onClick={onClick} className="aspect-square border rounded-md p-5">
      {Icon && <Icon className={cn("h-full w-full", iconClassName)} />}
      {image && <Image alt="" src={image} height={56} width={56} className={cn(imageClassName)} />}
    </button>
  );
};

export { ShapeTool };
