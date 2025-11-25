import { useCallback, useEffect, useState } from "react";
import { useOverlayContext } from "../context/OverlayContext";

interface HoleRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseOverlayManagerProps {
  shelfWrapperRef?: React.RefObject<HTMLDivElement | null>;
  questionRef?: React.RefObject<HTMLButtonElement | null>;
}

export function useOverlayManager({
  shelfWrapperRef: _shelfWrapperRef,
  questionRef,
}: UseOverlayManagerProps = {}) {
  const {
    overlayActive,
    showOverlay,
    setShowOverlay,
    dontShowChecked,
    setDontShowChecked,
    albumHoleRect,
    linkHoleRect,
    lpHoleRect,
    requestHoleRects,
  } = useOverlayContext();

  const [questionHoleRect, setQuestionHoleRect] = useState<HoleRect | null>(
    null
  );

  // request context to compute/set hole rects
  const sendFirstAlbumRect = useCallback(() => {
    // prefer the context's requestHoleRects helper which will compute album/link/lp rects
    try {
      requestHoleRects();
    } catch {
      // ignore
    }
  }, [requestHoleRects]);

  // compute question icon rect while overlay is visible
  const computeQuestionRect = useCallback(() => {
    try {
      const el = questionRef?.current;
      if (!el) return setQuestionHoleRect(null);
      const r = el.getBoundingClientRect();
      setQuestionHoleRect({
        x: r.left,
        y: r.top,
        width: r.width,
        height: r.height,
      });
    } catch {
      setQuestionHoleRect(null);
    }
  }, [questionRef]);

  // When showOverlay changes, request rects via context. The provider already
  // toggles the body class, so we don't need to manage it here.
  useEffect(() => {
    if (showOverlay) {
      // request rects immediately / next tick / delayed handled by provider
      sendFirstAlbumRect();
    }
  }, [showOverlay, sendFirstAlbumRect]);

  // The provider drives overlayActive/showOverlay state. If other parts of
  // the app want to toggle overlay, they should call the provider's setters.

  // Older code used explicit window events for requesting rects. The context
  // replacement exposes `requestHoleRects` which other components can call.

  // also send rect on resize/scroll while overlayActive
  useEffect(() => {
    const onResize = () => {
      if (overlayActive) sendFirstAlbumRect();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, [overlayActive, sendFirstAlbumRect]);

  // If overlay is already active on mount, send the rect once so the header can create the hole.
  useEffect(() => {
    if (overlayActive) sendFirstAlbumRect();
  }, [overlayActive, sendFirstAlbumRect]);

  // Listen to hole rect events
  // album/link/lp rects are now provided by context; keep local setters in case
  // other consumers still call the old window events during migration.

  // compute question rect when overlay is visible
  useEffect(() => {
    if (showOverlay && questionRef) {
      computeQuestionRect();
      setTimeout(computeQuestionRect, 0);
    } else {
      setQuestionHoleRect(null);
    }

    const onResize = () => {
      if (showOverlay) computeQuestionRect();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, [showOverlay, computeQuestionRect, questionRef]);

  const handleDontShowChange = useCallback((next: boolean) => {
    try {
      localStorage.setItem("board_overlay_dont_show", next ? "true" : "false");
    } catch {
      // ignore
    }
    setDontShowChecked(next);
    if (next) setShowOverlay(false);
  }, [setDontShowChecked, setShowOverlay]);

  return {
    overlayActive,
    showOverlay,
    setShowOverlay,
    dontShowChecked,
    setDontShowChecked: handleDontShowChange,
    albumHoleRect,
    questionHoleRect,
    linkHoleRect,
    lpHoleRect,
    sendFirstAlbumRect,
    computeQuestionRect,
  };
}
