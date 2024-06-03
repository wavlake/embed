import BoostIcon from "../icons/BOOST.svg";
import { getZapRequestInvoice } from "../utils/zapRequest";
import { PaymentScreen } from "./paymentScreen";
import { TextInput } from "./textInput";
import WavGraphic from "./wavGraphic";
import { bytesToHex } from "@noble/hashes/utils";
import { dateToUnix, useNostrEvents } from "nostr-react";
import { generateSecretKey, getPublicKey } from "nostr-tools";
import { useEffect, useState, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

const wavlakePubKey = process.env.NEXT_PUBLIC_NOSTR_PUBKEY || "";

const BoostButton = () => {
  return (
    <button
      type="submit"
      className="flex items-center gap-1 fill-white text-white hover:fill-brand-pink hover:text-brand-pink"
    >
      <p>Zap</p>
      <BoostIcon className="h-9 cursor-pointer" />
    </button>
  );
};

export const BoostForm = ({ contentId, backToPlayer, trackPlayedSeconds }) => {
  const [webLnAvailable, setWebLnAvailable] = useState(true);
  const [paymentRequest, setPaymentRequest] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [randomPubkey, setRandomPubkey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [zapError, setZapError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [watchForZapReceipt, setWatchForZapReceipt] = useState(false);
  const [eventIndex, setEventIndex] = useState(undefined);
  const [zapAmount, setZapAmount] = useState(0);

  useEffect(() => {
    if (typeof window.webln === "undefined") {
      setWebLnAvailable(false);
    }
  }, []);

  const now = useRef(new Date());
  const zapReceiptFilter = {
    kinds: [9735],
    since: dateToUnix(now.current),
  };

  const { events } = useNostrEvents({
    filter: zapReceiptFilter,
    enabled: watchForZapReceipt,
  });

  useEffect(() => {
    // done if no events
    if (!events.length) return;
    // done if we've already checked all events
    // without this early return, we'll get stuck in an infinite loop
    if (events.length - 1 === eventIndex) return;
    // update event index
    setEventIndex(events.length - 1);
    // grab the most recently added event
    const [newEvent] = events;
    // check event
    checkEvent(newEvent);
  }, [events]);

  const checkEvent = (event) => {
    const isZapFromListener = event.tags.some(
      ([tag, value]) =>
        tag === "description" && JSON.parse(value).pubkey === randomPubkey
    );

    if (isZapFromListener) {
      setSuccessMessage(`Boosted ${zapAmount} sats! ⚡️`);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setZapAmount(data.amount);
    // generate random secret key to sign the zap request
    const randomSecret = generateSecretKey();
    setRandomPubkey(getPublicKey(randomSecret));

    try {
      const invoice = await getZapRequestInvoice({
        content: data.comment,
        trackId: contentId,
        satAmount: data.amount,
        timestamp: trackPlayedSeconds,
        randomSecret: bytesToHex(randomSecret),
      });

      if (!invoice) {
        setZapError("Error creating invoice");
        setIsSubmitting(false);
        return;
      }

      const paymentRequest = invoice;

      if (webLnAvailable) {
        try {
          await webln.enable();
          const result = await window.webln.sendPayment(paymentRequest);
          if (result.preimage) {
            setIsLoading(false);
            setSuccessMessage(`Boosted ${data.amount} sats! ⚡️`);
          }
          return;
        } catch (err) {
          // user cancelled WebLN
          // proceed with regular QR code
        }
      }

      setPaymentRequest(paymentRequest);
      setIsLoading(false);
      setWatchForZapReceipt(true);
    } catch (e) {
      console.error(e);
    }
  };

  const methods = useForm({
    defaultValues: {
      amount: undefined,
      comment: undefined,
    },
  });

  const resetBoostPage = () => {
    methods.reset();
    setPaymentRequest("");
    setSuccessMessage("");
    setWatchForZapReceipt(false);
  };

  if (successMessage) {
    setTimeout(() => {
      backToPlayer();
      resetBoostPage();
      setWatchForZapReceipt(false);
    }, 4000);

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 rounded-3xl bg-brand-black p-4">
        <WavGraphic />
        <p className="text-lg text-white">{successMessage}</p>
        <button
          onClick={backToPlayer}
          type="button"
          className="text-white hover:text-gray-300"
        >
          Back
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl bg-brand-black p-4">
        <p className="text-lg text-white">Processing...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-3xl bg-brand-black p-4">
      <button
        onClick={backToPlayer}
        type="button"
        className="self-end py-2 pr-3"
      >
        Back
      </button>
      {paymentRequest ? (
        <PaymentScreen
          paymentRequest={paymentRequest}
          setPaymentRequest={setPaymentRequest}
        />
      ) : (
        <FormProvider {...methods}>
          <form
            className="mt-20 flex flex-grow flex-col items-center gap-4"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <TextInput
              fieldName="amount"
              type="number"
              title="Amount (sats)"
              helperText="Min 1 sats, max 100,000 sats"
              options={{
                required: "Please enter an amount",
                min: {
                  value: 1,
                  message: "Must zap at least something, like 21 sats",
                },
                max: {
                  value: 100000,
                  message: "Maximum 100 000 sats",
                },
              }}
            />
            <TextInput
              fieldName="comment"
              type="textarea"
              title="Message (optional)"
              options={{
                required: false,
                maxLength: {
                  value: 312,
                  message: "Max 312 characters",
                },
              }}
              helperText="Max 312 characters"
            />
            <BoostButton />
          </form>
        </FormProvider>
      )}
    </div>
  );
};
