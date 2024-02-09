import PauseIcon from "./../icons/pause.svg";
import PlayIcon from "./../icons/play.svg";

export default function EmbedPlayButton(props) {
  const { isPlaying, clickHandler } = props;

  return (
    <button
      onClick={clickHandler}
      className="h-7 rounded-full bg-brand-pink fill-black p-2 font-semibold tracking-tight transition hover:bg-brand-pink-light"
    >
      {isPlaying ? (
        <PauseIcon className="h-3"></PauseIcon>
      ) : (
        // translate-x-px makes the icon look centered
        <PlayIcon className="h-3 translate-x-px"></PlayIcon>
      )}
    </button>
  );
}
