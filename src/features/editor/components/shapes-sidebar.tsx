import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";
import { IoTriangle, IoStar } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import { BsPentagonFill, BsHexagonFill, BsOctagonFill } from "react-icons/bs";
import {
  ImArrowDown,
  ImArrowLeft,
  ImArrowRight,
  ImArrowUp,
  ImPlus,
} from "react-icons/im";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ShapeTool } from "@/features/editor/components/shape-tool";
import { POLYGON_MATRICES } from "@/features/editor/constants";
import { cn } from "@/lib/utils";

interface ShapesSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const ShapesSidebar = ({
  activeTool,
  editor,
  onChangeActiveTool,
}: ShapesSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "shapes" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Shapes"
        description="Add shapes to your canvas"
      />
      <ScrollArea>
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool onClick={() => editor?.addCircle()} icon={FaCircle} />
          <ShapeTool
            onClick={() => editor?.addSoftRectangle()}
            icon={FaSquare}
          />
          <ShapeTool
            onClick={() => editor?.addRectangle()}
            icon={FaSquareFull}
          />
          <ShapeTool onClick={() => editor?.addTriangle()} icon={IoTriangle} />
          <ShapeTool
            onClick={() => editor?.addInvertedTriangle()}
            icon={IoTriangle}
            iconClassName="rotate-180"
          />
          <ShapeTool onClick={() => editor?.addDiamond()} icon={FaDiamond} />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["pentagon"])}
            icon={BsPentagonFill}
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["hexagon_vertical"])
            }
            icon={BsHexagonFill}
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["hexagon_horizontal"])
            }
            icon={BsHexagonFill}
            iconClassName="rotate-90"
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["octagon"])}
            icon={BsOctagonFill}
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["4_pointed_star"])}
            image="/four_points_star.svg"
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["5_pointed_star"])}
            icon={IoStar}
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["6_pointed_star"])}
            image="/six_points_star.svg"
            imageClassName="rotate-90"
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["8_pointed_star"])}
            image="/eight_points_star.svg"
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["arrow_right"])}
            icon={ImArrowRight}
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["arrow_left"])}
            icon={ImArrowLeft}
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["arrow_up"])}
            icon={ImArrowUp}
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["arrow_down"])}
            icon={ImArrowDown}
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["arrow_horizontal"])
            }
            image="/arrow_horizontal.svg"
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["arrow_block_right"])
            }
            image="/arrow_block_right.svg"
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["arrow_block_2_right"])
            }
            image="/arrow_block_2_right.svg"
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["arrow_block_concave"])
            }
            image="/arrow_block_concave.svg"
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["arrow_block_convex"])
            }
            image="/arrow_block_convex.svg"
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["cross"])}
            icon={ImPlus}
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["banner_2"])
            }
            image="/banner_2.svg"
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["banner_3"])
            }
            image="/banner_3.svg"
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["banner_5"])
            }
            image="/banner_5.svg"
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["parallelogram_left"])
            }
            icon={FaSquareFull}
            iconClassName="skew-x-[20deg] h-[50px] w-[60px]"
          />
          <ShapeTool
            onClick={() =>
              editor?.addShape(POLYGON_MATRICES["parallelogram_right"])
            }
            icon={FaSquareFull}
            iconClassName="-skew-x-[20deg] h-[50px] w-[60px]"
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["trapezoid_up"])}
            image="/trapezoid.svg"
          />
          <ShapeTool
            onClick={() => editor?.addShape(POLYGON_MATRICES["trapezoid_down"])}
            image="/trapezoid.svg"
            imageClassName="rotate-180"
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export { ShapesSidebar };
