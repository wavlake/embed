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
  const { trackData } = props;

  useEffect(() => {
    if (typeof window != "undefined") {
      setHasWindow(true);
    }
  }, []);

  return trackData.length > 0 ? (
    <div className="relative max-w-3xl tracking-tight text-white transition">
      <FlipCard
        isFlipped={viewForm}
        frontComponent={
          <div className="flex flex-col gap-8 rounded-3xl bg-brand-black p-4">
            <NowPlaying
              trackData={trackData}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              trackProgress={trackProgress}
              playerRef={reactPlayer}
              openBoostForm={() => setViewForm(true)}
              setCurrentTrackIndex={setCurrentTrackIndex}
            />
            {trackData.length > 1 && (
              <TrackList
                setCurrentTrackIndex={setCurrentTrackIndex}
                trackData={trackData}
              />
            )}
          </div>
        }
        backComponent={
          <BoostForm
            contentId={trackData[currentTrackIndex]?.id}
            backToPlayer={() => setViewForm(false)}
          />
        }
      />
      {hasWindow && (
        <ReactPlayer
          ref={reactPlayer}
          controls={false}
          url={trackData[currentTrackIndex].liveUrl}
          playing={isPlaying}
          onPlay={() => {
            console.log("onPlay handler");
            !isPlaying && setIsPlaying(true);
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
