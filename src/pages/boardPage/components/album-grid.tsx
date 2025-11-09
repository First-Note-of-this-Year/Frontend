import ShelfBg from "@/assets/bg_shelf.webp";
import HeartIcon from "@/assets/ic_heart.svg";
import type { BoardListItem, SharedBoardMessage } from "@/types/board";

interface AlbumGridProps {
  boardList: BoardListItem[] | SharedBoardMessage[];
  isSharedBoard: boolean;
  shelfRef: React.RefObject<HTMLImageElement | null>;
  shelfWrapperRef: React.RefObject<HTMLDivElement | null>;
  onComputeShift: () => void;
  onAlbumClick: (id: number) => void;
  screenWidth: number;
}

export function AlbumGrid({
  boardList,
  isSharedBoard,
  shelfRef,
  shelfWrapperRef,
  onComputeShift,
  onAlbumClick,
  screenWidth,
}: AlbumGridProps) {
  // Calculate responsive gaps
  // 390px 기준: 나머지 열 10px, 첫 번째 열 22px
  const horizontalGap =
    screenWidth >= 390 ? 10 : Math.max(5, 10 - (390 - screenWidth) * 0.05);
  const firstRowGap =
    screenWidth >= 390 ? 22 : Math.max(15, 22 - (390 - screenWidth) * 0.07);
  const sideMargin =
    screenWidth >= 390 ? 14 : Math.max(7, 14 - (390 - screenWidth) * 0.08);

  // Helper function to check if position is developer comment (always at index 5 on first page)
  const isDeveloperCommentPosition = (globalIndex: number) => globalIndex === 5;

  return (
    <div ref={shelfWrapperRef} className="relative mb-8 inline-block">
      <img
        ref={shelfRef}
        src={ShelfBg}
        onLoad={onComputeShift}
        className="block h-auto max-w-full"
        alt="shelf"
      />

      {/* First row with 2 items - separate grid */}
      <div
        className="absolute left-0 w-full"
        style={{
          top: "13px",
          display: "grid",
          gridTemplateColumns: `${sideMargin}px 60px ${firstRowGap}px 60px ${sideMargin}px`,
          columnGap: "0",
          rowGap: "0",
          padding: "10px 15px",
          justifyContent: "center",
          marginLeft: "-3px",
        }}
      >
        <div style={{ gridColumn: "1 / 2" }} />

        {boardList.slice(0, 2).map((item, index) => {
          const messageId = isSharedBoard
            ? (item as SharedBoardMessage).messageId
            : (item as BoardListItem).messageId;
          const coverImage = isSharedBoard
            ? (item as SharedBoardMessage).coverImage
            : (item as BoardListItem).coverImage;
          const isRead = !isSharedBoard && (item as BoardListItem).read;
          const isDeveloperComment = isDeveloperCommentPosition(index);
          const isEmpty = messageId?.startsWith('empty-');

          // 빈 아이템은 빈 div로 렌더링 (그리드 위치 유지)
          if (isEmpty) {
            return (
              <div
                key={`album-${messageId}`}
                style={{
                  gridColumn: index === 0 ? "2 / 3" : "4 / 5",
                  width: "60px",
                  height: "60px",
                }}
              />
            );
          }

          return (
            <button
              key={`album-${messageId}`}
              type="button"
              aria-label={`album-cover-${messageId}`}
              onClick={() => {
                onAlbumClick(index + 1);
              }}
              style={{
                gridColumn: index === 0 ? "2 / 3" : "4 / 5",
                width: "60px",
                height: "60px",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transition: "transform 120ms ease",
                position: "relative",
              }}
              className="hover:scale-105"
            >
              {isDeveloperComment ? (
                <img
                  src={HeartIcon}
                  alt="developer-comment"
                  style={{
                    width: "60px",
                    height: "60px",
                    display: "block",
                  }}
                />
              ) : (
                <>
                  <img
                    src={coverImage}
                    alt={`album-cover-${messageId}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      display: "block",
                      borderRadius: "4px",
                    }}
                  />
                  {isRead && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "60px",
                        height: "60px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                </>
              )}
            </button>
          );
        })}

        <div style={{ gridColumn: "5 / 6" }} />
      </div>

      {/* Rows 2-4 with 3 items each - separate grid */}
      <div
        className="absolute left-0 w-full"
        style={{
          top: "calc(13px + 60px + 25px)",
          display: "grid",
          gridTemplateColumns: "60px 60px 60px",
          columnGap: `${horizontalGap}px`,
          rowGap: "25px",
          padding: "10px 15px",
          justifyContent: "center",
          marginLeft: "-3px",
        }}
      >
        {boardList.slice(2, 11).map((item, index) => {
          const messageId = isSharedBoard
            ? (item as SharedBoardMessage).messageId
            : (item as BoardListItem).messageId;
          const coverImage = isSharedBoard
            ? (item as SharedBoardMessage).coverImage
            : (item as BoardListItem).coverImage;
          const isRead = !isSharedBoard && (item as BoardListItem).read;
          const isDeveloperComment = isDeveloperCommentPosition(index + 2);
          const isEmpty = messageId?.startsWith('empty-');

          // 빈 아이템은 빈 div로 렌더링 (그리드 위치 유지)
          if (isEmpty) {
            return (
              <div
                key={`album-${messageId}`}
                style={{
                  width: "60px",
                  height: "60px",
                }}
              />
            );
          }

          return (
            <button
              key={`album-${messageId}`}
              type="button"
              aria-label={`album-cover-${messageId}`}
              onClick={() => {
                onAlbumClick(index + 3);
              }}
              style={{
                width: "60px",
                height: "60px",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transition: "transform 120ms ease",
                position: "relative",
              }}
              className="hover:scale-105"
            >
              {isDeveloperComment ? (
                <img
                  src={HeartIcon}
                  alt="developer-comment"
                  style={{
                    width: "60px",
                    height: "60px",
                    display: "block",
                  }}
                />
              ) : (
                <>
                  <img
                    src={coverImage}
                    alt={`album-cover-${messageId}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      display: "block",
                      borderRadius: "4px",
                    }}
                  />
                  {isRead && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "60px",
                        height: "60px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
