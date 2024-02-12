const formatSeconds = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = (duration % 60).toString().padEnd(2, "0");

  return `${minutes}:${seconds}`;
};

const Track = ({ track, isPlaylist, order, onClick }) => {
  return (
    <div
      className="text-md box-content flex py-1 px-2 hover:cursor-pointer hover:rounded-md hover:bg-neutral-800"
      onClick={onClick}
    >
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
export const TrackList = ({ trackData, isPlaylist, setCurrentTrackIndex }) => {
  const onClick = (index) => {
    setCurrentTrackIndex(index);
  };

  return (
    <div className="flex max-h-96 flex-col overflow-y-scroll font-light">
      {trackData.map((track, index) => (
        <Track
          key={track.id}
          order={index + 1}
          track={track}
          isPlaylist={isPlaylist}
          onClick={() => onClick(index)}
        />
      ))}
    </div>
  );
};
