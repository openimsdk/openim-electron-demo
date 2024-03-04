import { ForwardedRef, useCallback, useImperativeHandle, useState } from "react";

export interface OverlayVisibleHandle {
  isOverlayOpen: boolean;
  openOverlay: () => void;
  closeOverlay: () => void;
}

export function useOverlayVisible(ref: ForwardedRef<OverlayVisibleHandle>) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const openOverlay = useCallback(() => {
    setIsOverlayOpen(true);
  }, []);
  const closeOverlay = useCallback(() => {
    setIsOverlayOpen(false);
  }, []);

  useImperativeHandle(ref, () => ({
    isOverlayOpen,
    openOverlay,
    closeOverlay,
  }));

  return {
    isOverlayOpen,
    openOverlay,
    closeOverlay,
  };
}
