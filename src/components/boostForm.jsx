import BoostIcon from "../icons/BOOST.svg";
import { TextInput } from "./textInput";
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

export const BoostForm = ({
  isOpen,
  trackData,
  currentTrackIndex,
  successMessage,
  backToPlayer,
}) => {
  const onSubmit = (data) => {
    console.log({ data });
    // handleSubmit((data) =>
    //           handleBoost({
    //             ...data,
    //             trackId: trackData[currentTrackIndex].id,
    //           })
    //         )
  };
  const methods = useForm({
    defaultValues: {
      sats: undefined,
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
            fieldName="sats"
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
