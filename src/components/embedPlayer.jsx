import { BoostForm } from "./boostForm";
import { FlipCard } from "./flipCard";
import NoExist from "./noExist";
import { NowPlaying } from "./nowPlaying";
import { TrackList } from "./trackList";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export default function EmbedPlayer(props) {
  // Hydration fix for ReactPlayer & React 18
  const [hasWindow, setHasWindow] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackPlayedSeconds, setTrackPlayedSeconds] = useState(0);
  const [viewForm, setViewForm] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const reactPlayer = useRef();
  const { trackData, showSats } = props;

  // Normalize before anything reads .length. The catalog can hand back
  // undefined, a non-array, or an array with empty slots (e.g. [undefined]
  // when a single track lookup misses) — all of those must fall through to
  // <NoExist /> rather than throw during server rendering.
  const tracks = Array.isArray(trackData) ? trackData.filter(Boolean) : [];
  const hasTracks = tracks.length > 0;
  const isSingle = tracks.length === 1;
  const activeTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (typeof window != "undefined") {
      setHasWindow(true);
    }
  }, []);

  const handleTrackEnd = () => {
    if (currentTrackIndex < tracks.length - 1) {
      // play the next track
      setCurrentTrackIndex(currentTrackIndex + 1);
      setIsPlaying(true);
    } else {
      // loop back to the beginning
      setCurrentTrackIndex(0);
    }
  };

  return hasTracks ? (
    <div
      className={`h-full w-full rounded-3xl bg-brand-black p-4 tracking-tight text-white transition`}
    >
      <FlipCard
        isFlipped={viewForm}
        frontComponent={
          <div
            className={`${
              isSingle ? "max-w-md" : "max-w-3xl"
            } mx-auto flex h-full flex-col gap-8`}
          >
            <NowPlaying
              trackData={tracks}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              trackProgress={trackProgress}
              playerRef={reactPlayer}
              openBoostForm={() => setViewForm(true)}
              setCurrentTrackIndex={setCurrentTrackIndex}
              isSingle={isSingle}
            />
            {!isSingle && (
              <TrackList
                setCurrentTrackIndex={setCurrentTrackIndex}
                trackData={tracks}
                showSats={showSats}
              />
            )}
          </div>
        }
        backComponent={
          <div
            className={`${
              isSingle ? "max-w-md" : "max-w-3xl"
            } mx-auto flex h-full`}
          >
            <BoostForm
              contentId={activeTrack?.id}
              backToPlayer={() => setViewForm(false)}
              trackPlayedSeconds={trackPlayedSeconds}
            />
          </div>
        }
      />
      {hasWindow && (
        <ReactPlayer
          ref={reactPlayer}
          controls={false}
          url={activeTrack?.liveUrl}
          playing={isPlaying}
          onEnded={handleTrackEnd}
          // if the player play/pause state is toggled by something other than the play button
          // we need to update the state to reflect that
          // e.g. a keyboard shortcut play/pause button
          onPlay={() => {
            !isPlaying && setIsPlaying(true);
          }}
          onPause={() => {
            isPlaying && setIsPlaying(false);
          }}
          height="0"
          width="0"
          onProgress={(progress) => {
            setTrackProgress(progress.played * 100);
            setTrackPlayedSeconds(parseInt(progress.playedSeconds));
          }}
        />
      )}
    </div>
  ) : (
    <NoExist />
  );
}
