import { useCallback, useEffect, useState } from "react";

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
  shelfWrapperRef,
  questionRef,
}: UseOverlayManagerProps = {}) {
  const initialDontShow = (() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("board_overlay_dont_show") === "true";
    } catch {
      return false;
    }
  })();

  const [overlayActive, setOverlayActive] = useState<boolean>(
    typeof document !== "undefined" &&
      document.body.classList.contains("board-overlay-active")
  );
  const [dontShowChecked, setDontShowChecked] =
    useState<boolean>(initialDontShow);
  const [showOverlay, setShowOverlay] = useState<boolean>(
    () => !initialDontShow
  );

  const [albumHoleRect, setAlbumHoleRect] = useState<HoleRect | null>(null);
  const [questionHoleRect, setQuestionHoleRect] = useState<HoleRect | null>(
    null
  );
  const [linkHoleRect, setLinkHoleRect] = useState<HoleRect | null>(null);
  const [lpHoleRect, setLpHoleRect] = useState<HoleRect | null>(null);

  // compute and dispatch first album rect relative to viewport
  const sendFirstAlbumRect = useCallback(() => {
    if (!shelfWrapperRef?.current) return;
    try {
      // find first album button inside the first-row grid (gridColumn 2 / 3)
      let firstEl = shelfWrapperRef.current.querySelector(
        '[aria-label^="album-cover-"]'
      ) as HTMLElement | null;
      // fallback to a dedicated anchor element if no album element exists
      if (!firstEl) {
        firstEl = shelfWrapperRef.current.querySelector(
          '[data-first-album-anchor]'
        ) as HTMLElement | null;
      }
      if (!firstEl) return;
      const rect = firstEl.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent("boardOverlayHoleRect", {
          detail: {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          },
        })
      );
    } catch {
      // ignore
    }
  }, [shelfWrapperRef]);

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

  // Handle overlay change
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (showOverlay) document.body.classList.add("board-overlay-active");
      else document.body.classList.remove("board-overlay-active");
    }

    try {
      window.dispatchEvent(
        new CustomEvent("boardOverlayChange", { detail: showOverlay })
      );
      // also request the first-album rect so the grid can respond with coordinates
      if (shelfWrapperRef) {
        try {
          window.dispatchEvent(new CustomEvent("boardOverlayRequestHoleRect"));
        } catch {}
      }
      setTimeout(() => {
        try {
          window.dispatchEvent(
            new CustomEvent("boardOverlayChange", { detail: showOverlay })
          );
          // re-request the hole rect on next tick as well
          if (shelfWrapperRef) {
            try {
              window.dispatchEvent(
                new CustomEvent("boardOverlayRequestHoleRect")
              );
            } catch {}
          }
        } catch {}
      }, 0);
      if (showOverlay && shelfWrapperRef) {
        setTimeout(() => {
          try {
            window.dispatchEvent(
              new CustomEvent("boardOverlayRequestHoleRect")
            );
          } catch {}
        }, 150);
      }
    } catch {
      // ignore
    }

    return () => {
      if (typeof document !== "undefined")
        document.body.classList.remove("board-overlay-active");
    };
  }, [showOverlay, shelfWrapperRef]);

  // Listen to overlay change from other sources (e.g., album-grid)
  useEffect(() => {
    const handler = (e: Event) => {
      // event detail may be boolean
      const ce = e as CustomEvent<boolean>;
      const val = Boolean(ce.detail);
      setOverlayActive(val);
      // when overlay becomes active, send hole rect for first album
      if (val && shelfWrapperRef) {
        setTimeout(() => {
          sendFirstAlbumRect();
        }, 0);
      } else {
        // clear hole
        try {
          window.dispatchEvent(
            new CustomEvent("boardOverlayHoleRect", { detail: null })
          );
        } catch {}
      }
    };

    window.addEventListener("boardOverlayChange", handler as EventListener);
    return () =>
      window.removeEventListener(
        "boardOverlayChange",
        handler as EventListener
      );
  }, [sendFirstAlbumRect, shelfWrapperRef]);

  // Respond to explicit requests for the hole rect to avoid mount-order races.
  useEffect(() => {
    if (!shelfWrapperRef) return;
    const reqHandler = (_e: Event) => {
      try {
        // respond on next tick to allow layout to settle
        setTimeout(() => {
          sendFirstAlbumRect();
        }, 0);
      } catch {
        // ignore
      }
    };

    window.addEventListener(
      "boardOverlayRequestHoleRect",
      reqHandler as EventListener
    );
    return () =>
      window.removeEventListener(
        "boardOverlayRequestHoleRect",
        reqHandler as EventListener
      );
  }, [sendFirstAlbumRect, shelfWrapperRef]);

  // also send rect on resize/scroll while overlayActive
  useEffect(() => {
    if (!shelfWrapperRef) return;
    const onResize = () => {
      if (overlayActive) sendFirstAlbumRect();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, [overlayActive, sendFirstAlbumRect, shelfWrapperRef]);

  // If overlay is already active on mount, send the rect once so the header can create the hole.
  useEffect(() => {
    if (overlayActive && shelfWrapperRef) sendFirstAlbumRect();
  }, [overlayActive, sendFirstAlbumRect, shelfWrapperRef]);

  // Fallback: if the body already has the overlay class on initial mount,
  // ensure we send the rect after a short delay.
  useEffect(() => {
    if (!shelfWrapperRef) return;
    if (
      typeof document !== "undefined" &&
      document.body.classList.contains("board-overlay-active")
    ) {
      setTimeout(() => {
        sendFirstAlbumRect();
      }, 50);
    }
  }, [sendFirstAlbumRect, shelfWrapperRef]);

  // Listen to hole rect events
  useEffect(() => {
    const albumHandler = (e: Event) => {
      const ce = e as CustomEvent<null | HoleRect>;
      setAlbumHoleRect(ce.detail ?? null);
    };
    const linkHandler = (e: Event) => {
      const ce = e as CustomEvent<null | HoleRect>;
      setLinkHoleRect(ce.detail ?? null);
    };
    const lpHandler = (e: Event) => {
      const ce = e as CustomEvent<null | HoleRect>;
      setLpHoleRect(ce.detail ?? null);
    };

    window.addEventListener(
      "boardOverlayHoleRect",
      albumHandler as EventListener
    );
    window.addEventListener(
      "boardOverlayLinkRect",
      linkHandler as EventListener
    );
    window.addEventListener("boardOverlayLpRect", lpHandler as EventListener);

    return () => {
      window.removeEventListener(
        "boardOverlayHoleRect",
        albumHandler as EventListener
      );
      window.removeEventListener(
        "boardOverlayLinkRect",
        linkHandler as EventListener
      );
      window.removeEventListener(
        "boardOverlayLpRect",
        lpHandler as EventListener
      );
    };
  }, []);

  // compute question rect when overlay is visible
  useEffect(() => {
    if (showOverlay && questionRef) {
      computeQuestionRect();
      setTimeout(computeQuestionRect, 0);
    } else {
      setQuestionHoleRect(null);
      setLinkHoleRect(null);
      setLpHoleRect(null);
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
  }, []);

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
