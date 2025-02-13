import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react";
import * as fabric from "fabric";

import { JSON_KEYS } from "../constants";

interface UseLoadStateProps {
  autoZoom: () => void;
  canvas: fabric.Canvas | null;
  initialState: RefObject<string | undefined>;
  canvasHistory: RefObject<string[]>;
  setHistoryIndex: Dispatch<SetStateAction<number>>;
}

const useLoadState = ({
  autoZoom,
  canvas,
  canvasHistory,
  initialState,
  setHistoryIndex,
}: UseLoadStateProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialState.current && canvas) {
      const data = JSON.parse(initialState.current);

      canvas.loadFromJSON(data).then(() => {
        const currentState = JSON.stringify(canvas.toDatalessJSON(JSON_KEYS));

        canvasHistory.current = [currentState];
        setHistoryIndex(0);
        autoZoom();

        initialized.current = true;
      });
    }
  }, [canvas, autoZoom, initialState, canvasHistory, setHistoryIndex]);
};

export { useLoadState };
