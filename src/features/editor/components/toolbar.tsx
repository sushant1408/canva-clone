import { useState } from "react";
import { BsBorderWidth } from "react-icons/bs";
import { RxTransparencyGrid } from "react-icons/rx";
import {
  ChevronDownIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  type LucideIcon,
  TrashIcon,
  CopyIcon,
} from "lucide-react";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { TbColorFilter } from "react-icons/tb";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ActiveTool, Editor, TextAlignment } from "../types";
import { isImageType, isTextType } from "../utils";
import { FONT_SIZE, FONT_WEIGHT, TEXT_ALIGNMENT_OPTIONS } from "../constants";
import { FontSizeInput } from "./font-size-input";

const TextAlignmentIconMap: Record<TextAlignment, LucideIcon> = {
  center: AlignCenterIcon,
  left: AlignLeftIcon,
  right: AlignRightIcon,
  justify: AlignJustifyIcon,
};

interface ToolbarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const Toolbar = ({ activeTool, editor, onChangeActiveTool }: ToolbarProps) => {
  const initialFillColor = editor?.getActiveFillColor();
  const initialStrokeColor = editor?.getActiveStrokeColor();
  const initialFontFamily = editor?.getActiveFontFamily();
  const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const initialFontStyle = editor?.getActiveFontStyle() || "normal";
  const initialFontUnderline = editor?.getActiveFontUnderline() || false;
  const initialFontStrikethrough =
    editor?.getActiveFontStrikethrough() || false;
  const initialTextAlignment = editor?.getActiveTextAlignment() || "left";
  const initialFontSize = editor?.getActiveFontSize() || FONT_SIZE;

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontWeight: initialFontWeight,
    fontStyle: initialFontStyle,
    fontUnderline: initialFontUnderline,
    fontStrikethrough: initialFontStrikethrough,
    textAlignment: initialTextAlignment,
    fontSize: initialFontSize,
  });

  const selectedObject = editor?.selectedObjects[0];
  const selectedObjectType = editor?.selectedObjects[0]?.type;
  const Icon = TextAlignmentIconMap[properties.textAlignment];

  const isTextObjectSelected = isTextType(selectedObjectType);
  const isImageObjecSelected = isImageType(selectedObjectType);

  const toggleBold = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontWeight > 500 ? 500 : 700;

    editor.changeFontWeight(newValue);
    setProperties((prevState) => ({
      ...prevState,
      fontWeight: newValue,
    }));
  };

  const toggleItalic = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontStyle === "normal" ? "italic" : "normal";

    editor.changeFontStyle(newValue);
    setProperties((prevState) => ({
      ...prevState,
      fontStyle: newValue,
    }));
  };

  const toggleUnderline = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = !properties.fontUnderline;

    editor.changeFontUnderline(newValue);
    setProperties((prevState) => ({
      ...prevState,
      fontUnderline: newValue,
    }));
  };

  const toggleStrikethrough = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = !properties.fontStrikethrough;

    editor.changeFontStrikeThrough(newValue);
    setProperties((prevState) => ({
      ...prevState,
      fontStrikethrough: newValue,
    }));
  };

  const onChangeTextAlignment = () => {
    if (!selectedObject) {
      return;
    }

    const currentValueIndex = TEXT_ALIGNMENT_OPTIONS.indexOf(
      properties.textAlignment
    );
    const nextValueIndex =
      (currentValueIndex + 1) % TEXT_ALIGNMENT_OPTIONS.length;

    const newValue = TEXT_ALIGNMENT_OPTIONS[nextValueIndex];

    editor.changeTextAlignment(newValue);
    setProperties((prevState) => ({
      ...prevState,
      textAlignment: newValue,
    }));
  };

  const onChangeFontSize = (value: number) => {
    if (!selectedObject) {
      return;
    }

    editor.changeFontSize(value);
    setProperties((prevState) => ({
      ...prevState,
      fontSize: value,
    }));
  };

  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      {isImageObjecSelected && (
        <>
          <div className="flex items-center h-full justify-center">
            <Button
              onClick={() => onChangeActiveTool("filter")}
              variant="ghost"
              className={cn(activeTool === "filter" && "bg-gray-100")}
            >
              <TbColorFilter className="size-4 mr-2" />
              Filters
            </Button>
          </div>
          <Separator orientation="vertical" />
        </>
      )}
      {!isImageObjecSelected && (
        <div className="flex items-center h-full justify-center">
          <TooltipWrapper label="Color" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("fill")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "fill" && "bg-gray-100")}
            >
              <div
                className="rounded-sm size-4 border"
                style={{
                  backgroundColor: properties.fillColor,
                }}
              />
            </Button>
          </TooltipWrapper>
        </div>
      )}
      {!isTextObjectSelected && (
        <>
          <div className="flex items-center h-full justify-center">
            <TooltipWrapper label="Border color" side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool("stroke-color")}
                size="icon"
                variant="ghost"
                className={cn(activeTool === "stroke-color" && "bg-gray-100")}
              >
                <div
                  className="rounded-sm size-4 border-2 bg-white"
                  style={{
                    borderColor: properties.strokeColor,
                  }}
                />
              </Button>
            </TooltipWrapper>
          </div>
          <div className="flex items-center h-full justify-center">
            <TooltipWrapper label="Border style" side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool("stroke-width")}
                size="icon"
                variant="ghost"
                className={cn(activeTool === "stroke-width" && "bg-gray-100")}
              >
                <BsBorderWidth className="size-4" />
              </Button>
            </TooltipWrapper>
          </div>
        </>
      )}
      <Separator orientation="vertical" />
      <div className="flex items-center h-full justify-center">
        <TooltipWrapper label="Opacity" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </TooltipWrapper>
      </div>
      {isTextObjectSelected && (
        <>
          <Separator orientation="vertical" />
          <div className="flex items-center h-full justify-center">
            <TooltipWrapper label="Font" side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool("font")}
                size="icon"
                variant="ghost"
                className={cn(
                  "w-auto px-2 text-sm",
                  activeTool === "font" && "bg-gray-100"
                )}
              >
                <div className="max-w-[100px] truncate">
                  {properties.fontFamily}
                </div>
                <ChevronDownIcon className="size-4 ml-2 shrink-0" />
              </Button>
            </TooltipWrapper>
          </div>
          <div className="flex items-center h-full justify-center">
            <FontSizeInput
              value={properties.fontSize}
              onChange={onChangeFontSize}
            />
          </div>
          <Separator orientation="vertical" />
          <TooltipWrapper label="Bold" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleBold}
              size="icon"
              variant="ghost"
              className={cn(properties.fontWeight > 500 && "bg-gray-100")}
            >
              <FaBold className="size-4" />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper label="Italic" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleItalic}
              size="icon"
              variant="ghost"
              className={cn(properties.fontStyle === "italic" && "bg-gray-100")}
            >
              <FaItalic className="size-4" />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper label="Underline" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleUnderline}
              size="icon"
              variant="ghost"
              className={cn(properties.fontUnderline && "bg-gray-100")}
            >
              <FaUnderline className="size-4" />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper label="Strikethrough" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleStrikethrough}
              size="icon"
              variant="ghost"
              className={cn(properties.fontStrikethrough && "bg-gray-100")}
            >
              <FaStrikethrough className="size-4" />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper label="Alignment" side="bottom" sideOffset={5}>
            <Button onClick={onChangeTextAlignment} size="icon" variant="ghost">
              <Icon className="size-4" />
            </Button>
          </TooltipWrapper>
        </>
      )}
      <Separator orientation="vertical" />
      <div className="flex items-center h-full justify-center">
        <Button
          onClick={() => onChangeActiveTool("position")}
          variant="ghost"
          className={cn(activeTool === "position" && "bg-gray-100")}
        >
          Position
        </Button>
      </div>
      <div className="flex items-center h-full justify-center">
        <TooltipWrapper label="Duplicate" side="bottom" sideOffset={5}>
          <Button
            onClick={async () => {
              await editor?.onCopy();
              editor?.onPaste();
            }}
            size="icon"
            variant="ghost"
          >
            <CopyIcon className="size-4" />
          </Button>
        </TooltipWrapper>
      </div>
      <Separator orientation="vertical" />
      <div className="flex items-center h-full justify-center">
        <TooltipWrapper label="Delete" side="bottom" sideOffset={5}>
          <Button onClick={() => editor?.delete()} size="icon" variant="ghost">
            <TrashIcon className="size-4" />
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
};

export { Toolbar };
