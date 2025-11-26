import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type HoleRect = { x: number; y: number; width: number; height: number } | null;

type LayoutHelpers = {
  shelfRef?: React.RefObject<HTMLImageElement | null>;
  shelfWrapperRef?: React.RefObject<HTMLDivElement | null>;
  contentLeft?: number;
  shiftPx?: { x: number; y: number };
  getAdjustedPositions?: () => Array<{ id: number; x: number; y: number }>;
};

type OverlayContextValue = {
  overlayActive: boolean;
  setOverlayActive: (v: boolean) => void;
  showOverlay: boolean;
  setShowOverlay: (v: boolean) => void;
  dontShowChecked: boolean;
  setDontShowChecked: (v: boolean) => void;
  albumHoleRect: HoleRect;
  linkHoleRect: HoleRect;
  lpHoleRect: HoleRect;
  setAlbumHoleRect: (r: HoleRect) => void;
  setLinkHoleRect: (r: HoleRect) => void;
  setLpHoleRect: (r: HoleRect) => void;
  registerLayoutHelpers: (h?: LayoutHelpers) => void;
  registerLinkRef: (ref?: React.RefObject<HTMLElement | null>) => void;
  registerLpRef: (ref?: React.RefObject<HTMLElement | null>) => void;
  requestHoleRects: () => void;
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [overlayActive, setOverlayActive] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [dontShowChecked, setDontShowChecked] = useState<boolean>(false);

  const [albumHoleRect, setAlbumHoleRect] = useState<HoleRect>(null);
  const [linkHoleRect, setLinkHoleRect] = useState<HoleRect>(null);
  const [lpHoleRect, setLpHoleRect] = useState<HoleRect>(null);

  const layoutRef = useRef<LayoutHelpers>({});
  const linkRef = useRef<React.RefObject<HTMLElement | null> | null>(null);
  const lpRef = useRef<React.RefObject<HTMLElement | null> | null>(null);

  // keep body class in sync with overlayActive
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (overlayActive) document.body.classList.add("board-overlay-active");
    else document.body.classList.remove("board-overlay-active");
  }, [overlayActive]);

  const computeAlbumRect = useCallback((): HoleRect => {
    try {
      const wrap = layoutRef.current.shelfWrapperRef?.current;
      if (wrap) {
        const firstEl = wrap.querySelector(
          '[aria-label^="album-cover-"]'
        ) as HTMLElement | null;
        if (firstEl) {
          const r = firstEl.getBoundingClientRect();
          return { x: r.left, y: r.top, width: r.width, height: r.height };
        }
      }

      // fallback compute
      const img = layoutRef.current.shelfRef?.current;
      const positions = layoutRef.current.getAdjustedPositions?.();
      if (!img || !positions || positions.length === 0) return null;
      const firstPos = positions[0];
      const imgRect = img.getBoundingClientRect();
      const albumWidth = 60;
      const x =
        imgRect.left +
        (layoutRef.current.contentLeft ?? 0) +
        (layoutRef.current.shiftPx?.x ?? 0) +
        (firstPos.x ?? 0) +
        15 -
        3 +
        (layoutRef.current.shiftPx?.x ? 0 : 0);
      const y =
        imgRect.top + (layoutRef.current.shiftPx?.y ?? 0) + (firstPos.y ?? 0);
      return { x, y, width: albumWidth, height: albumWidth };
    } catch {
      return null;
    }
  }, []);

  const computeLinkRect = useCallback((): HoleRect => {
    try {
      const ref = linkRef.current?.current;
      if (!ref) return null;
      const r = ref.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    } catch {
      return null;
    }
  }, []);

  const computeLpRect = useCallback((): HoleRect => {
    try {
      const ref = lpRef.current?.current;
      if (!ref) return null;
      const r = ref.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    } catch {
      return null;
    }
  }, []);

  const requestHoleRects = useCallback(() => {
    // compute and set rects; do immediate, next tick, and delayed to mimic previous behavior
    const run = () => {
      setAlbumHoleRect(computeAlbumRect());
      setLinkHoleRect(computeLinkRect());
      setLpHoleRect(computeLpRect());
    };

    try {
      run();
    } catch {}

    setTimeout(() => {
      try {
        run();
      } catch {}
    }, 0);

    setTimeout(() => {
      try {
        run();
      } catch {}
    }, 150);
  }, [computeAlbumRect, computeLinkRect, computeLpRect]);

  const registerLayoutHelpers = (h?: LayoutHelpers) => {
    layoutRef.current = h ?? {};
  };

  const registerLinkRef = (ref?: React.RefObject<HTMLElement | null>) => {
    linkRef.current = ref ?? null;
  };

  const registerLpRef = (ref?: React.RefObject<HTMLElement | null>) => {
    lpRef.current = ref ?? null;
  };

  const value: OverlayContextValue = {
    overlayActive,
    setOverlayActive,
    showOverlay,
    setShowOverlay,
    dontShowChecked,
    setDontShowChecked,
    albumHoleRect,
    linkHoleRect,
    lpHoleRect,
    setAlbumHoleRect,
    setLinkHoleRect,
    setLpHoleRect,
    registerLayoutHelpers,
    registerLinkRef,
    registerLpRef,
    requestHoleRects,
  };

  return (
    <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
  );
}

export function useOverlayContext() {
  const ctx = React.useContext(OverlayContext);
  if (!ctx)
    throw new Error("useOverlayContext must be used within OverlayProvider");
  return ctx;
}

export default OverlayContext;
