const BoostForm = () => {
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
