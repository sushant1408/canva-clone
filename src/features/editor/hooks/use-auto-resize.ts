import * as fabric from "fabric";
import { useCallback, useEffect } from "react";

interface UseAutoResizeProps {
  container: HTMLDivElement | null;
  canvas: fabric.Canvas | null;
}

const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  const autoZoom = useCallback(() => {
    if (!canvas || !container) {
      return;
    }

    const height = container.offsetHeight;
    const width = container.offsetWidth;

    canvas.setDimensions({
      width,
      height,
    });

    const center = canvas.getCenterPoint();

    const zoomRatio = 0.85;
    const localWorkspace = canvas
      .getObjects()
      // @ts-expect-error
      .find((object) => object.name === "workspace");

    if (!localWorkspace) {
      return;
    }

    const scale = fabric.util.findScaleToFit(localWorkspace, {
      width,
      height,
    });

    const zoom = scale * zoomRatio;

    // @ts-expect-error
    canvas.setViewportTransform(fabric.iMatrix.concat());
    canvas.zoomToPoint(new fabric.Point(center.x, center.y), zoom);

    const workspaceCenter = localWorkspace.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;

    if (
      canvas.height === undefined ||
      canvas.width === undefined ||
      !viewportTransform
    ) {
      return;
    }

    viewportTransform[4] =
      canvas.width / 2 - workspaceCenter.x * viewportTransform[0];
    viewportTransform[5] =
      canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

    canvas.setViewportTransform(viewportTransform);

    localWorkspace.clone()?.then((cloned) => {
      canvas.clipPath = cloned;
      canvas.requestRenderAll();
    });
  }, [canvas, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (canvas && container) {
      resizeObserver = new ResizeObserver(() => {
        autoZoom();
      });

      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvas, container, autoZoom]);

  return { autoZoom };
};

export { useAutoResize };
