import BoostIcon from "../icons/BOOST.svg";
import poll from "../utils/poll";
import { checkInvoice, getInvoice } from "../utils/provider";
import { PaymentScreen } from "./paymentScreen";
import { TextInput } from "./textInput";
import WavGraphic from "./wavGraphic";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window.webln === "undefined") {
      setWebLnAvailable(false);
    }
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const payload = {
      trackId: contentId,
      amount: data.amount,
      type: "boost",
      timestamp: trackPlayedSeconds,
      // metadata: {},
    };

    try {
      const result = await getInvoice(payload);

      const resultJson = await result.json();

      const paymentRequest = resultJson.payment_request;
      const paymentHash = resultJson.payment_hash;

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

      poll({
        fn: checkInvoice,
        data: { paymentHash: paymentHash },
        interval: 12000,
        maxAttempts: 12,
      })
        .then(() => {
          // success
          setSuccessMessage(`Boosted ${data.amount} sats! ⚡️`);
        })
        .catch(() => {
          // failure
          console.error("Boost check failed");
        });
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
  };

  if (successMessage) {
    setTimeout(() => {
      backToPlayer();
      resetBoostPage();
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
              helperText="Min 10 sats, max 100,000 sats"
              options={{
                required: "Please enter an amount",
                min: {
                  value: 10,
                  message: "Must zap at least something, like 10 sats",
                },
                max: {
                  value: 100000,
                  message: "Maximum 100 000 sats",
                },
              }}
            />
            {/* <TextInput
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
            /> */}
            <BoostButton />
          </form>
        </FormProvider>
      )}
    </div>
  );
};
