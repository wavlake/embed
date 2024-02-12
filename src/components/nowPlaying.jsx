import CommentIcon from "../icons/COMMENT.svg";
import EmbedPlayButton from "./embedPlayButton";
import {
  NowPlayingMetadata,
  Logo,
  NowPlayingAlbumArt,
} from "./nowPlayingMetadata";
import { PlayerControls } from "./playerControls";

const BoostButton = ({}) => {
  return (
    <button
      className="rounded-full fill-white transition hover:fill-brand-pink"
      type="submit"
    >
      <CommentIcon className="h-8 translate-y-[-3px]" />
    </button>
  );
};

export const NowPlaying = ({
  trackData,
  currentTrackIndex,
  setCurrentTrackIndex,
  isPlaying,
  setIsPlaying,
  trackProgress,
  viewForm,
  setViewForm,
  successMessage,
  handleBoost,
  playerRef,
}) => {
  const activeContent = trackData[currentTrackIndex];
  return (
    <div className="flex w-full flex-row items-start gap-3 rounded-3xl bg-neutral-800 px-4 pt-4">
      <NowPlayingAlbumArt activeContent={activeContent} />
      <EmbedPlayButton
        clickHandler={() => setIsPlaying(!isPlaying)}
        isPlaying={isPlaying}
      />
      <div className="flex grow flex-col">
        <div className="flex flex-row items-start gap-2">
          <NowPlayingMetadata activeContent={activeContent} />
          <BoostButton />
          <Logo activeContent={activeContent} />
        </div>
        <PlayerControls
          playerRef={playerRef}
          trackProgress={trackProgress}
          multiTrack={trackData.length > 1}
        />
      </div>
    </div>
  );
};
