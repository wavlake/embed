const formatSeconds = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = (duration % 60).toString().padEnd(2, "0");

  return `${minutes}:${seconds}`;
};

const Track = ({ track, isPlaylist, order }) => {
  return (
    <div className="text-md flex">
      <div className="w-8">{order}.</div>
      {isPlaylist ? (
        <div className="grow">{track.title}</div>
      ) : (
        <div className="flex grow flex-col">
          <p>{track.title}</p>
          <p className="text-sm text-gray-500">{track.artist}</p>
        </div>
      )}
      <div className="pr-2 text-gray-500">{formatSeconds(track.duration)}</div>
    </div>
  );
};
export const TrackList = ({ trackData, isPlaylist }) => {
  return (
    <div className="flex max-h-96 flex-col gap-1 overflow-y-scroll">
      {trackData.map((track, index) => (
        <Track
          key={track.id}
          order={index + 1}
          track={track}
          isPlaylist={isPlaylist}
        />
      ))}
    </div>
  );
};
