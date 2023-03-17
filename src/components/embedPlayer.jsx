import BoostIcon from "../icons/BOOST.svg";
import LogoIcon from "../icons/LOGO.svg";
import poll from "../utils/poll";
import { checkInvoice, getInvoice } from "../utils/provider";
import EmbedForwardButton from "./embedForwardButton";
import EmbedPlayButton from "./embedPlayButton";
import FundingInvoiceModal from "./fundingInvoiceModal";
import NoExist from "./noExist";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";

const shareUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

export default function EmbedPlayer(props) {
  const ref = useRef(null);

  // Hydration fix for ReactPlayer & React 18
  const [hasWindow, setHasWindow] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [viewForm, setViewForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [webLnAvailable, setWebLnAvailable] = useState(true);
  const [width, setWidth] = useState(0);
  const [paymentRequest, setPaymentRequest] = useState("");
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (typeof window != "undefined") {
      setHasWindow(true);
    }
    if (typeof window.webln === "undefined") {
      setWebLnAvailable(false);
    }
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);

  const { trackData } = props;

  const trackDataLength = trackData.length - 1;

  async function handleBoost(data) {
    try {
      const result = await getInvoice(data);

      const resultJson = await result.json();

      const paymentRequest = resultJson.payment_request;
      const paymentHash = resultJson.payment_hash;

      if (webLnAvailable) {
        try {
          await webln.enable();
          const result = await window.webln.sendPayment(paymentRequest);
          if (result.preimage) {
            setSuccessMessage(`Boosted ${data.amount} sats! ⚡️`);
            setViewForm(false);
            reset();
          }
        } catch (err) {
          alert(err);
        }
      } else {
        setPaymentRequest(paymentRequest);
        setIsInvoiceOpen(true);
        poll({
          fn: checkInvoice,
          data: { paymentHash: paymentHash },
          interval: 12000,
          maxAttempts: 12,
        })
          .then(() => {
            setIsInvoiceOpen(false);
            setViewForm(false);
            setSuccessMessage(`Boosted ${data.amount} sats! ⚡️`);
            reset();
          })
          .catch(() => {
            setIsInvoiceOpen(false);
            setViewForm(false);
          });
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      {trackData.length > 0 ? (
        <div>
          <div className="absolute top-1 left-0 right-1 z-20 m-auto">
            <FundingInvoiceModal
              reset={reset}
              isInvoiceOpen={isInvoiceOpen}
              setIsInvoiceOpen={setIsInvoiceOpen}
              paymentRequest={paymentRequest}
            />
          </div>
          <div className="grid max-w-xl grid-cols-1 grid-rows-2 space-x-1 space-y-1 rounded-xl bg-brand-black xs:grid-rows-3">
            {/* IMAGE CONTAINER */}
            <div className="row-span-2 mx-auto my-2 flex justify-start px-2 xs:my-auto">
              <Image
                src={trackData[currentTrackIndex].artworkUrl}
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
                  href={`${shareUrl}/track/${trackData[currentTrackIndex].id}`}
                  target={"_blank"}
                  rel={"noreferrer"}
                  className="flex items-center"
                >
                  <p className="text-sm font-semibold">
                    {trackData[currentTrackIndex].title}
                  </p>
                </a>
                <p className="mt-1 flex text-xs">
                  by {trackData[currentTrackIndex].artist}
                </p>
                {/* PROGRESS BAR */}
                <div className="my-2 border-b-2 border-brand-pink" ref={ref} />
                {/* Overlay */}
                <div
                  className="relative z-10 -translate-y-2.5 border-b-2 border-brand-pink-dark"
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
                        <span className="flex text-xs text-red-700">
                          Required
                        </span>
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
                    href={`${shareUrl}/track/${trackData[currentTrackIndex].id}`}
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
        </div>
      ) : (
        <NoExist />
      )}
      {hasWindow && trackData.length > 0 && (
        <ReactPlayer
          controls={false}
          url={trackData[currentTrackIndex].liveUrl}
          playing={isPlaying}
          height="0"
          width="0"
          onProgress={(progress) => {
            setTrackProgress(progress.played * 100);
          }}
        />
      )}
    </>
  );
}
