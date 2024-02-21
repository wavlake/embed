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
  const [viewForm, setViewForm] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const reactPlayer = useRef();
  const { trackData, showSats } = props;

  const isSingle = trackData.length === 1;

  useEffect(() => {
    if (typeof window != "undefined") {
      setHasWindow(true);
    }
  }, []);

  return trackData.length > 0 ? (
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
              trackData={trackData}
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
                trackData={trackData}
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
              contentId={trackData[currentTrackIndex]?.id}
              backToPlayer={() => setViewForm(false)}
            />
          </div>
        }
      />
      {hasWindow && (
        <ReactPlayer
          ref={reactPlayer}
          controls={false}
          url={trackData[currentTrackIndex].liveUrl}
          playing={isPlaying}
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
          }}
        />
      )}
    </div>
  ) : (
    <NoExist />
  );
}
