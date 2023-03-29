import PauseIcon from "./../icons/pause.svg";
import PlayIcon from "./../icons/play.svg";

const EmbedPlayButton: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  return (
    <div className="mr-2 flex h-7 cursor-pointer items-center space-x-1 rounded-full bg-brand-pink p-2 font-semibold tracking-tight hover:bg-brand-pink-light">
      {isPlaying ? (
        <PauseIcon className="flex h-3 fill-brand-black" />
      ) : (
        <PlayIcon className={`flex h-3 fill-brand-black`} />
      )}
    </div>
  );
};

export default EmbedPlayButton;
