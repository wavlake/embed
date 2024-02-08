import poll from "../utils/poll";
import { checkInvoice, getInvoice } from "../utils/provider";
import FundingInvoiceModal from "./fundingInvoiceModal";
import NoExist from "./noExist";
import { NowPlaying } from "./nowPlaying";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";

const shareUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

const contentLink = (isTrack, id) => {
  if (isTrack) {
    return `${shareUrl}/track/${id}`;
  } else {
    return `${shareUrl}/episode/${id}`;
  }
};

export default function EmbedPlayer(props) {
  // Hydration fix for ReactPlayer & React 18
  const [hasWindow, setHasWindow] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [viewForm, setViewForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [webLnAvailable, setWebLnAvailable] = useState(true);
  const [paymentRequest, setPaymentRequest] = useState("");
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const { reset } = useForm();

  useEffect(() => {
    if (typeof window != "undefined") {
      setHasWindow(true);
    }
    if (typeof window.webln === "undefined") {
      setWebLnAvailable(false);
    }
  }, []);

  const reactPlayer = useRef();

  const { trackData } = props;

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
          <NowPlaying
            trackData={trackData}
            currentTrackIndex={currentTrackIndex}
            setCurrentTrackIndex={setCurrentTrackIndex}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            trackProgress={trackProgress}
            viewForm={viewForm}
            setViewForm={setViewForm}
            successMessage={successMessage}
            handleBoost={handleBoost}
            contentLink={contentLink}
            playerRef={reactPlayer}
          />
        </div>
      ) : (
        <NoExist />
      )}
      {hasWindow && trackData.length > 0 && (
        <ReactPlayer
          ref={reactPlayer}
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
