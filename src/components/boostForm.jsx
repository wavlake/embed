import BoostIcon from "../icons/BOOST.svg";
import poll from "../utils/poll";
import { checkInvoice, getInvoice } from "../utils/provider";
import { TextInput } from "./textInput";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const BoostButton = () => {
  return (
    <button
      type="submit"
      className="flex items-center gap-1 fill-brand-pink-light text-brand-pink-light transition  hover:fill-brand-pink hover:text-brand-pink"
    >
      <p>Zap</p>
      <BoostIcon className="h-9 cursor-pointer" />
    </button>
  );
};

export const BoostForm = ({ contentId, backToPlayer }) => {
  const [webLnAvailable, setWebLnAvailable] = useState(true);

  useEffect(() => {
    if (typeof window.webln === "undefined") {
      setWebLnAvailable(false);
    }
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      trackId: contentId,
      amount: data.amount,
      type: "boost",
      metadata: {},
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
  };

  const methods = useForm({
    defaultValues: {
      amount: undefined,
      comment: undefined,
    },
  });

  return (
    <div className="flex flex-col rounded-3xl bg-brand-black p-4">
      <button
        onClick={backToPlayer}
        type="button"
        className="self-end pr-3 transition hover:text-brand-pink"
      >
        Back
      </button>
      <FormProvider {...methods}>
        <form
          className="flex flex-col items-center"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <TextInput
            fieldName="amount"
            type="number"
            title="Amount (sats)"
            helperText="Min 1 sat, max 100,000 sats"
            options={{
              required: "Please enter an amount",
              min: {
                value: 1,
                message: "Must zap at least 1 sat",
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
    </div>
  );
};
