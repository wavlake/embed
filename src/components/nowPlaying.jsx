import CommentIcon from "../icons/COMMENT.svg";
import EmbedPlayButton from "./embedPlayButton";
import {
  NowPlayingMetadata,
  Logo,
  NowPlayingAlbumArt,
} from "./nowPlayingMetadata";
import { PlayerControls } from "./playerControls";

const BoostButton = ({ onClick }) => {
  return (
    <button
      className="rounded-full fill-white hover:fill-brand-pink"
      type="button"
      onClick={onClick}
    >
      <CommentIcon className="h-8 translate-y-[-3px]" />
    </button>
  );
};

export const NowPlaying = ({
  trackData,
  currentTrackIndex,
  isPlaying,
  setIsPlaying,
  trackProgress,
  playerRef,
  openBoostForm,
  setCurrentTrackIndex,
  isSingle,
}) => {
  const activeContent = trackData[currentTrackIndex];

  return isSingle ? (
    <div className="flex flex-col items-center">
      <NowPlayingAlbumArt isSingle={isSingle} activeContent={activeContent} />
      <div className="flex w-full flex-row justify-between pr-1">
        <NowPlayingMetadata activeContent={activeContent} />
        <BoostButton onClick={openBoostForm} />
      </div>
      <div className="flex w-full flex-row items-center gap-3">
        <EmbedPlayButton
          clickHandler={() => setIsPlaying(!isPlaying)}
          isPlaying={isPlaying}
        />
        <PlayerControls
          playerRef={playerRef}
          trackProgress={trackProgress}
          isSingle={isSingle}
          currentTrackIndex={currentTrackIndex}
          trackDataLength={trackData.length}
          setCurrentTrackIndex={setCurrentTrackIndex}
        />
        <Logo activeContent={activeContent} />
      </div>
    </div>
  ) : (
    <div
      className={`flex w-full flex-row items-start gap-3 rounded-3xl bg-brand-black-light px-4 pt-4`}
    >
      <NowPlayingAlbumArt activeContent={activeContent} />
      <EmbedPlayButton
        clickHandler={() => setIsPlaying(!isPlaying)}
        isPlaying={isPlaying}
      />
      <div className="flex grow flex-col">
        <div className="flex flex-row items-start gap-2">
          <NowPlayingMetadata activeContent={activeContent} />
          <BoostButton onClick={openBoostForm} />
          <Logo activeContent={activeContent} />
        </div>
        <PlayerControls
          playerRef={playerRef}
          trackProgress={trackProgress}
          isSingle={isSingle}
          currentTrackIndex={currentTrackIndex}
          trackDataLength={trackData.length}
          setCurrentTrackIndex={setCurrentTrackIndex}
        />
      </div>
    </div>
  );
};
