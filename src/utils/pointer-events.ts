import { addEffect, EventManager, useThree } from "@react-three/fiber";
import {
  ForwardEventsOptions,
  forwardHtmlEvents,
} from "@pmndrs/pointer-events";
import { useEffect } from "react";

export function PointerEvents({
  batchEvents,
  clickThesholdMs,
  contextMenuButton,
  customSort,
  dblClickThresholdMs,
  filter,
  forwardPointerCapture,
  intersectEveryFrame,
  pointerTypePrefix,
}: ForwardEventsOptions) {
  const domElement = useThree((s) => s.gl.domElement);
  const alwaysRendering = useThree((s) => s.frameloop === "always");
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const { destroy, update } = forwardHtmlEvents(
      domElement,
      () => camera,
      scene,
      {
        batchEvents: batchEvents ?? alwaysRendering,
        clickThesholdMs,
        contextMenuButton,
        customSort,
        dblClickThresholdMs,
        filter,
        forwardPointerCapture,
        intersectEveryFrame,
        pointerTypePrefix,
      },
    );
    const cleanupUpdate = addEffect(update);
    return () => {
      cleanupUpdate();
      destroy();
    };
  }, [
    domElement,
    camera,
    scene,
    alwaysRendering,
    batchEvents,
    clickThesholdMs,
    contextMenuButton,
    customSort,
    dblClickThresholdMs,
    filter,
    forwardPointerCapture,
    intersectEveryFrame,
    pointerTypePrefix,
  ]);
  return null;
}

export const noEvents = (): EventManager<HTMLElement> => ({
  enabled: false,
  priority: 0,
});
