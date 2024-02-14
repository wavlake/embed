import EmbedForwardButton from "./embedForwardButton";
import { useRef } from "react";

// This is determined by guess and check
// Click the progress bar and see where the progress jumps to, adjust as needed
const PROGRESS_BAR_CLICK_OFFSET = 190;

const ProgressBar = ({ trackProgress, playerRef }) => {
  const progressBarRef = useRef(null);

  const onSeekHandler = ({ clientX }) => {
    const progressBarWidth = progressBarRef?.current?.offsetWidth ?? 0;
    if (progressBarWidth === 0) return;

    const clickXPosition = clientX - PROGRESS_BAR_CLICK_OFFSET;
    const targetSeek = clickXPosition / progressBarWidth;
    playerRef.current.seekTo(targetSeek);
  };

  return (
    <button
      className="group relative flex h-3 grow flex-col justify-center"
      id="progressBar"
      ref={progressBarRef}
      onClick={onSeekHandler}
    >
      <div className="h-1 w-full rounded-sm bg-gray-500" />
      <div
        className={`absolute z-10 h-1 rounded-sm bg-white`}
        style={{
          width: `${trackProgress}%`,
          transitionProperty: "width",
          transitionDuration: "0.5s",
          transitionTimingFunction: "linear",
        }}
      >
        {/* scrubber element WIP */}
        {/* <div
          className={`absolute top-1/2 right-0 h-2 w-2 translate-y-[-50%] translate-x-1 transform rounded-full bg-white group-hover:block`}
        /> */}
      </div>
    </button>
  );
};

export const PlayerControls = ({
  playerRef,
  trackProgress,
  isSingle,
  currentTrackIndex,
  trackDataLength,
  setCurrentTrackIndex,
}) => {
  return (
    <div className="flex h-10 grow flex-row items-center gap-2">
      {!isSingle && (
        <button
          onClick={() => {
            if (!isSingle && currentTrackIndex > 0) {
              // move to previous track, unless we're on index 0
              setCurrentTrackIndex(currentTrackIndex - 1);
            } else {
              // single track, restart track
              playerRef.current.seekTo(0);
            }
          }}
          className="rotate-180"
        >
          <EmbedForwardButton />
        </button>
      )}
      <ProgressBar trackProgress={trackProgress} playerRef={playerRef} />
      {!isSingle && (
        <button
          className=""
          onClick={() => {
            if (currentTrackIndex < trackDataLength - 1) {
              setCurrentTrackIndex(currentTrackIndex + 1);
            }
          }}
        >
          <EmbedForwardButton />
        </button>
      )}
    </div>
  );
};
