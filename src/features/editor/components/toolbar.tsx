import { Editor } from "../types";

interface ToolbarProps {
  editor: Editor | undefined;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      Toolbar
    </div>
  );
};

export { Toolbar };
