import { satsAbbreviated } from "../utils/format";

const formatSeconds = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = (duration % 60).toString().padEnd(2, "0");

  return `${minutes}:${seconds}`;
};

const Track = ({ track, isMultiTrack, order, onClick, showSats }) => {
  return (
    <div
      className="group box-content flex gap-2 px-4 py-0.5 text-sm transition hover:cursor-pointer hover:rounded-md hover:bg-brand-black-light"
      onClick={onClick}
    >
      <div className="min-w-7 w-7 flex-none">{order}.</div>
      <div className="flex flex-grow flex-col overflow-hidden">
        <p className="truncate">{track.title}</p>
        {isMultiTrack && (
          <p className="truncate text-sm text-gray-500">{track.artist}</p>
        )}
      </div>
      {/* If track has msatTotal, show it, otherwise show duration */}
      {showSats ? (
        <div className="min-w-10 w-24 flex-none text-right text-gray-500">
          {satsAbbreviated(track.msatTotal)} sats
        </div>
      ) : (
        <div className="min-w-10 w-10 flex-none text-left text-gray-500">
          {formatSeconds(track.duration)}
        </div>
      )}
    </div>
  );
};

export const TrackList = ({ trackData, setCurrentTrackIndex, showSats }) => {
  const onClick = (index) => {
    setCurrentTrackIndex(index);
  };

  const isMultiTrack = trackData.length > 1;
  return (
    <div className="flex h-full flex-col overflow-y-auto font-light">
      {trackData.map((track, index) => (
        <Track
          key={track.id}
          order={index + 1}
          track={track}
          isMultiTrack={isMultiTrack}
          onClick={() => onClick(index)}
          showSats={showSats}
        />
      ))}
    </div>
  );
};
