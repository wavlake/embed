import BoostIcon from "../icons/BOOST.svg";
import LogoIcon from "../icons/LOGO.svg";
import EmbedForwardButton from "./embedForwardButton";
import EmbedPlayButton from "./embedPlayButton";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { useForm } from "react-hook-form";

const shareUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

const contentLink = (isTrack, id) => {
  if (isTrack) {
    return `${shareUrl}/track/${id}`;
  } else {
    return `${shareUrl}/episode/${id}`;
  }
};

const parentContentLink = (isTrack, id) => {
  if (isTrack) {
    return `${shareUrl}/${id}`;
  } else {
    return `${shareUrl}/podcast/${id}`;
  }
};

const ContentMetadata = ({ activeContent }) => {
  return (
    <div className="flex grow flex-col">
      <a
        href={contentLink(
          activeContent.podcast === undefined,
          activeContent.id
        )}
        target={"_blank"}
        rel={"noreferrer"}
        className="max-w-fit hover:text-brand-pink"
      >
        <p className="text-md font-semibold">{activeContent.title}</p>
      </a>
      <a
        className="max-w-fit text-sm underline hover:text-brand-pink"
        href={parentContentLink(
          activeContent.podcast === undefined,
          activeContent.artistUrl || activeContent.podcast?.url
        )}
        target={"_blank"}
        rel={"noreferrer"}
      >
        {activeContent.artist ||
          activeContent.podcast?.name ||
          activeContent.podcast}
      </a>
    </div>
  );
};

const BoostButton = ({}) => {
  return (
    <button
      className="rounded-full fill-brand-pink transition hover:fill-brand-pink-light"
      type="submit"
    >
      <BoostIcon className="h-8" />
    </button>
  );
};

const Logo = ({ activeContent }) => {
  return (
    <a
      href={contentLink(activeContent.podcast === undefined, activeContent.id)}
      target={"_blank"}
      rel={"noreferrer"}
    >
      <LogoIcon className="h-7 fill-white" />
    </a>
  );
};

// This is determined by guess and check
// Click the progress bar and see where the progress jumps to, adjust as needed
const PROGRESS_BAR_CLICK_OFFSET = 180;

const ProgressBar = ({ trackProgress, playerRef }) => {
  const onSeekHandler = ({ clientX }) => {
    const progressBarWidth = document.getElementById("progressBar").offsetWidth;
    const clickXPosition = clientX - PROGRESS_BAR_CLICK_OFFSET;
    const targetSeek = clickXPosition / progressBarWidth;
    playerRef.current.seekTo(targetSeek);
  };

  return (
    <button
      className="relative flex h-3 grow flex-col justify-center"
      id="progressBar"
      onClick={onSeekHandler}
    >
      <div className="h-0.5 w-full rounded-sm bg-brand-pink" />
      <div
        className={`absolute z-10 h-0.5 rounded-sm bg-brand-pink-dark`}
        style={{
          width: `${trackProgress}%`,
          transitionProperty: "width",
          transitionDuration: "0.5s",
          transitionTimingFunction: "linear",
        }}
      />
    </button>
  );
};

const Controls = ({ playerRef, trackProgress, multiTrack }) => {
  return (
    <div className="flex h-10 grow flex-row items-center gap-2">
      <button
        onClick={() => {
          if (multiTrack && currentTrackIndex > 0) {
            // move to previous track, unless we're on index 0
            setCurrentTrackIndex(currentTrackIndex - 1);
          } else {
            // single track, restart track
            playerRef.current.seekTo(0);
          }
        }}
        className="rotate-180 hover:text-brand-pink"
      >
        <EmbedForwardButton />
      </button>
      <ProgressBar trackProgress={trackProgress} playerRef={playerRef} />
      {multiTrack && (
        <button
          className="hover:text-brand-pink"
          onClick={() => {
            if (currentTrackIndex < trackDataLength) {
              setCurrentTrackIndex(currentTrackIndex + 1);
            }
          }}
        >
          <EmbedForwardButton />
        </button>
      )}
    </div>
  );
};

export const NowPlaying = ({
  trackData,
  currentTrackIndex,
  setCurrentTrackIndex,
  isPlaying,
  setIsPlaying,
  trackProgress,
  viewForm,
  setViewForm,
  successMessage,
  handleBoost,
  playerRef,
}) => {
  const activeContent = trackData[currentTrackIndex];
  return (
    <div className="flex w-full flex-row items-start gap-3 rounded-3xl bg-neutral-800 px-4 pt-4">
      <a
        href={contentLink(
          activeContent.podcast === undefined,
          activeContent.id
        )}
        target={"_blank"}
        rel={"noreferrer"}
        className="pb-3"
      >
        <Image
          src={activeContent.artworkUrl || activeContent.podcast?.artworkUrl}
          width={70}
          height={70}
        />
      </a>
      <EmbedPlayButton
        clickHandler={() => setIsPlaying(!isPlaying)}
        isPlaying={isPlaying}
      />
      <div className="flex grow flex-col">
        <div className="flex flex-row items-start">
          <ContentMetadata activeContent={activeContent} />
          <BoostButton />
          <Logo activeContent={activeContent} />
        </div>
        <Controls
          playerRef={playerRef}
          trackProgress={trackProgress}
          multiTrack={trackData.length > 1}
        />
      </div>
    </div>
  );
};

const Forms = () => {
  return (
    <>
      <Transition
        show={viewForm}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0 -translate-x-20"
        enterTo="opacity-100"
        className="col-span-4"
      >
        <div className="">
          <form
            className="flex items-center"
            onSubmit={handleSubmit((data) =>
              handleBoost({
                ...data,
                trackId: trackData[currentTrackIndex].id,
              })
            )}
          >
            <input
              className="flex w-10 rounded-md px-2 text-sm tracking-tight focus:accent-brand-pink"
              defaultValue="1"
              {...register("amount", {
                required: true,
                pattern: /[1234567890]/,
              })}
            />
            {errors.amount && (
              <span className="flex text-xs text-red-700">Required</span>
            )}
            <p className="ml-1 flex text-xs tracking-tight text-white">sats</p>
            <BoostButton />
          </form>
        </div>
      </Transition>
      <Transition
        show={!viewForm}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0 translate-x-20"
        enterTo="opacity-100"
      >
        <div className="flex whitespace-nowrap text-xs italic tracking-tighter text-white">
          <p>{successMessage}</p>
        </div>
      </Transition>
    </>
  );
};
