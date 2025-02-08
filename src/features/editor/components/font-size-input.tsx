import { ChangeEvent, useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fontSizes } from "../constants";

interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
}

const FontSizeInput = ({ onChange, value }: FontSizeInputProps) => {
  const [open, setOpen] = useState(false);

  const increment = () => onChange(value + 1);

  const decrement = () => onChange(value - 1);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      onChange(0);
      setOpen(false);
      return;
    }

    const numericValue = parseInt(event.target.value, 10);
    const valueWithLimits = Math.min(999, Math.max(0, numericValue));

    onChange(valueWithLimits);
    setOpen(false);
  };

  const handleMenuItemClick = (value: number) => {
    onChange(value);
    setOpen(false);
  };

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        onClick={decrement}
        className="p-2 rounded-r-none border-r-0"
      >
        <MinusIcon className="size-4" />
      </Button>

      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Input
            onChange={handleChange}
            value={value}
            onClick={() => setOpen(true)}
            inputMode="numeric"
            type="text"
            className="w-[50px] h-8 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onInteractOutside={() => setOpen(false)}
          className="w-[114px] max-h-[410px] overflow-y-auto"
        >
          {fontSizes.map((fontSize) => (
            <DropdownMenuCheckboxItem
              key={fontSize}
              onClick={(e) => {
                e.preventDefault();
                handleMenuItemClick(fontSize);
              }}
              checked={value === fontSize}
            >
              {fontSize}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        onClick={increment}
        className="p-2 rounded-l-none border-l-0"
      >
        <PlusIcon className="size-4" />
      </Button>
    </div>
  );
};

export { FontSizeInput };
