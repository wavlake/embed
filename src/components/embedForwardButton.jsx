import { FastForwardIcon } from "@heroicons/react/solid";

export default function EmbedForwardButton(props) {
  const { isPlaying } = props;

  return (
    <div className="flex h-7 cursor-pointer items-center space-x-1 rounded-full bg-brand-black-light p-2 font-semibold tracking-tight hover:bg-brand-pink-light">
      <FastForwardIcon className="flex w-3 fill-brand-black" />
    </div>
  );
}
