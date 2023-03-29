import { FastForwardIcon } from "@heroicons/react/solid";

const EmbedForwardButton: React.FC<{ isPlaying: boolean }> = ({
  isPlaying,
}) => (
  <div className="flex h-7 cursor-pointer items-center space-x-1 rounded-full bg-brand-black-light p-2 font-semibold tracking-tight hover:bg-brand-pink-light">
    <FastForwardIcon className="flex w-3 fill-brand-black" />
  </div>
);

export default EmbedForwardButton;
