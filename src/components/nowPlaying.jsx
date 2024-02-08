import BoostIcon from "../icons/BOOST.svg";
import LogoIcon from "../icons/LOGO.svg";
import EmbedForwardButton from "./embedForwardButton";
import EmbedPlayButton from "./embedPlayButton";
import { Transition } from "@headlessui/react";
import Image from "next/image";

export const NowPlaying = ({
  trackData,
  currentTrackIndex,
  setCurrentTrackIndex,
  isPlaying,
  setIsPlaying,
  progressBarRef,
  onSeekHandler,
  trackProgress,
  viewForm,
  setViewForm,
  successMessage,
  handleBoost,
  handleSubmit,
  errors,
  contentLink,
  register,
}) => {
  const trackDataLength = trackData.length - 1;

  return (
    <div className="grid max-w-xl grid-cols-1 grid-rows-2 space-x-1 space-y-1 rounded-xl bg-brand-black xs:grid-rows-3">
      {/* IMAGE CONTAINER */}
      <div className="row-span-2 mx-auto my-2 flex justify-start px-2 xs:my-auto">
        <Image
          src={
            trackData[currentTrackIndex].artworkUrl ||
            trackData[currentTrackIndex].podcast?.artworkUrl
          }
          // layout={'fixed'}
          width={200}
          height={200}
        />
      </div>

      {/* TRACK METADATA & CONTROLS */}
      <div className="row-span-1 grid grid-rows-1 px-2 pb-3">
        {/* ROW 1 */}
        <div className="row-span-1 mt-1 tracking-tighter text-white">
          <a
            href={contentLink(
              trackData[currentTrackIndex].podcast === undefined,
              trackData[currentTrackIndex].id
            )}
            target={"_blank"}
            rel={"noreferrer"}
            className="flex items-center"
          >
            <p className="text-sm font-semibold">
              {trackData[currentTrackIndex].title}
            </p>
          </a>
          <p className="mt-1 flex text-xs">
            by{" "}
            {trackData[currentTrackIndex].artist ||
              trackData[currentTrackIndex].podcast?.name ||
              trackData[currentTrackIndex].podcast}
          </p>
          {/* PROGRESS BAR */}
          <div
            className="h-3"
            id="progressBar"
            ref={progressBarRef}
            onClick={onSeekHandler}
          >
            <div className="my-2 border-b-2 border-brand-pink pt-1" />
          </div>
          {/* Overlay */}
          <div
            className="relative z-10 -translate-y-2 border-b-2 border-brand-pink-dark"
            style={{
              width: `${trackProgress}%`,
              transitionProperty: "width",
              transitionDuration: "0.5s",
              transitionTimingFunction: "linear",
            }}
          />
        </div>

        {/* ROW 2 */}
        <div className="row-span-1 grid grid-cols-7 items-center">
          <div className="col-span-1 flex items-center justify-self-start">
            <div onClick={() => setIsPlaying(!isPlaying)}>
              <EmbedPlayButton isPlaying={isPlaying} />
            </div>
            {trackData.length > 1 && (
              <div
                onClick={() => {
                  if (currentTrackIndex < trackDataLength) {
                    setCurrentTrackIndex(currentTrackIndex + 1);
                  }
                }}
              >
                <EmbedForwardButton />
              </div>
            )}
          </div>
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
                <p className="ml-1 flex text-xs tracking-tight text-white">
                  sats
                </p>
                <button type="submit">
                  <BoostIcon className="h-9 cursor-pointer fill-brand-pink hover:fill-brand-pink-light" />
                </button>
              </form>
            </div>
          </Transition>
          <div
            className={`${!viewForm ? "col-span-4 flex" : "hidden"}`}
            onClick={() => setViewForm(!viewForm)}
          >
            <BoostIcon className="h-9 cursor-pointer fill-brand-black-light hover:fill-brand-pink-light" />
          </div>
          <div className="col-span-2 flex cursor-pointer justify-self-end">
            <a
              href={contentLink(
                trackData[currentTrackIndex].podcast === undefined,
                trackData[currentTrackIndex].id
              )}
              target={"_blank"}
              rel={"noreferrer"}
            >
              <LogoIcon className="flex h-8 fill-white" />
            </a>
          </div>
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
        </div>
      </div>
    </div>
  );
};
