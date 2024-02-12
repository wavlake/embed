import EmbedForwardButton from "./embedForwardButton";

// This is determined by guess and check
// Click the progress bar and see where the progress jumps to, adjust as needed
const PROGRESS_BAR_CLICK_OFFSET = 190;

const ProgressBar = ({ trackProgress, playerRef }) => {
  const onSeekHandler = ({ clientX }) => {
    const progressBarWidth = document.getElementById("progressBar").offsetWidth;
    const clickXPosition = clientX - PROGRESS_BAR_CLICK_OFFSET;
    const targetSeek = clickXPosition / progressBarWidth;
    playerRef.current.seekTo(targetSeek);
  };

  return (
    <button
      className="relative flex h-3 grow flex-col justify-center"
      id="progressBar"
      onClick={onSeekHandler}
    >
      <div className="h-0.5 w-full rounded-sm bg-brand-pink" />
      <div
        className={`absolute z-10 h-0.5 rounded-sm bg-brand-pink-dark`}
        style={{
          width: `${trackProgress}%`,
          transitionProperty: "width",
          transitionDuration: "0.5s",
          transitionTimingFunction: "linear",
        }}
      />
    </button>
  );
};

export const PlayerControls = ({ playerRef, trackProgress, multiTrack }) => {
  return (
    <div className="flex h-10 grow flex-row items-center gap-2">
      <button
        onClick={() => {
          if (multiTrack && currentTrackIndex > 0) {
            // move to previous track, unless we're on index 0
            setCurrentTrackIndex(currentTrackIndex - 1);
          } else {
            // single track, restart track
            playerRef.current.seekTo(0);
          }
        }}
        className="rotate-180 hover:text-brand-pink"
      >
        <EmbedForwardButton />
      </button>
      <ProgressBar trackProgress={trackProgress} playerRef={playerRef} />
      {multiTrack && (
        <button
          className="hover:text-brand-pink"
          onClick={() => {
            if (currentTrackIndex < trackDataLength) {
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