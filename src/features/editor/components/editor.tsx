"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import debounce from "lodash.debounce";

import { useEditor } from "@/features/editor/hooks/use-editor";
import { Navbar } from "@/features/editor/components/navbar";
import { Sidebar } from "@/features/editor/components/sidebar";
import { ShapesSidebar } from "@/features/editor/components/shapes-sidebar";
import { Toolbar } from "@/features/editor/components/toolbar";
import { Footer } from "@/features/editor/components/footer";
import { FillColorSidebar } from "@/features/editor/components/fill-color-sidebar";
import { StrokeColorSidebar } from "@/features/editor/components/stroke-color-sidebar";
import { StrokeWidthSidebar } from "@/features/editor/components/stroke-width-sidebar";
import { PositionSidebar } from "@/features/editor/components/position-sidebar";
import { OpacitySidebar } from "@/features/editor/components/opacity-sidebar";
import { TextSidebar } from "@/features/editor/components/text-sidebar";
import { FontSidebar } from "@/features/editor/components/font-sidebar";
import { ImagesSidebar } from "@/features/editor/components/images-sidebar";
import { ImageFilterSidebar } from "@/features/editor/components/image-filters-sidebar";
import { DrawSidebar } from "@/features/editor/components/draw-sidebar";
import { SettingsSidebar } from "@/features/editor/components/settings-sidebar";
import { ActiveTool, selectionDependentTools } from "@/features/editor/types";
import { ResponseType } from "@/features/projects/api/use-get-project";
import { useUpdateProject } from "@/features/projects/api/use-update-project";

// TODO: add shadows sidebar for shapes, text and images
// TODO: add drawing brush type options
// TODO: try to fix group alignment
// TODO: add flip option for images
// TODO: add layers sidebar with draggable layers list
// TODO: add floating options for active object
// TODO: add gradient support for shapes, text and workspace
// TODO: add background image support for workspace
// TODO: add lock/unlock layer functionality
// TODO: try to fix image filter bug
// TODO: add rename project in editor navbar

interface EditorProps {
  initialData: ResponseType["data"];
}

const Editor = ({ initialData }: EditorProps) => {
  const { mutate } = useUpdateProject(initialData.id);

  const debounceSave = useCallback(
    debounce(
      (values: { json: string; height: number; width: number }) =>
        mutate(values),
      1000
    ),
    [mutate]
  );

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const { init, editor } = useEditor({
    defaultState: initialData.json,
    defaultWidth: initialData.width,
    defaultHeight: initialData.height,
    clearSelectionCallback: onClearSelection,
    saveCallback: debounceSave,
  });

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === "draw") {
        editor?.enableDrawingMode();
      }

      if (activeTool === "draw") {
        editor?.disableDrawingMode();
      }

      if (tool === activeTool) {
        return setActiveTool("select");
      }

      setActiveTool(tool);
    },
    [activeTool, editor]
  );

  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      controlsAboveOverlay: true, // to show the controls for the objects outside the workspace
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  return (
    <div className="h-full flex flex-col">
      <Navbar
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
        id={initialData.id}
      />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapesSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />
        <FillColorSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />
        <StrokeColorSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />
        <StrokeWidthSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />
        <PositionSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />
        <OpacitySidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />
        <TextSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />
        <FontSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />
        <ImagesSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />
        <ImageFilterSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />
        <DrawSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />
        <SettingsSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          editor={editor}
        />

        <main className="flex-1 bg-muted overflow-auto relative flex flex-col">
          <Toolbar
            key={JSON.stringify(editor?.canvas.getActiveObject())}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            editor={editor}
          />
          <div ref={containerRef} className="flex-1 h-[calc(100%-124px)]">
            <canvas ref={canvasRef} />
          </div>
          <Footer
            key={JSON.stringify(editor?.canvas.getZoom())}
            editor={editor}
          />
        </main>
      </div>
    </div>
  );
};

export { Editor };
