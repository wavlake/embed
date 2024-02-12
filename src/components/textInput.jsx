import { useFormContext } from "react-hook-form";

export const FormError = ({ error }) => {
  return <span className="text-red-500">{error}</span>;
};

const FieldWrapper = ({
  error,
  title,
  children,
  helperText,
  fullHeight = false,
}) => {
  return (
    <div
      className={`relative flex w-full flex-col px-3 pt-3 
      ${fullHeight ? " h-full" : ""}`}
    >
      <label className="sr-only">{title}</label>
      {children}
      <div className="h-3 self-start pl-3 text-sm">
        {error ? (
          <FormError error={error} />
        ) : (
          <span className="text-gray-500">{helperText}</span>
        )}
      </div>
    </div>
  );
};

export const TextInput = ({
  fieldName,
  title,
  type = "text",
  className,
  options,
  customErrors,
  postInput,
  step = 1,
  autoComplete,
  helperText,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const fieldErrors = errors[fieldName];
  const errorMessage = customErrors?.message || fieldErrors?.message;

  if (type === "textarea") {
    return (
      <FieldWrapper title={title} error={errorMessage} helperText={helperText}>
        <textarea
          placeholder={title}
          {...register(fieldName, options)}
          className={
            "relative block h-full w-full appearance-none rounded-md border border-gray-300 px-3 py-2 font-normal text-gray-600 placeholder-gray-500 focus:z-10 focus:border-brand-pink focus:outline-none focus:ring-brand-pink sm:text-sm" +
            className
          }
        />
        {postInput}
      </FieldWrapper>
    );
  }

  if (type === "password") {
    return (
      <FieldWrapper title={title} error={errorMessage} helperText={helperText}>
        <input
          autoComplete={autoComplete}
          placeholder={title}
          {...register(fieldName, options)}
          type="password"
          className={
            "relative block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 font-normal text-gray-600 placeholder-gray-500 focus:z-10 focus:border-brand-pink focus:outline-none focus:ring-brand-pink sm:text-sm" +
            className
          }
        />
        {postInput}
      </FieldWrapper>
    );
  }

  if (type === "number") {
    return (
      <FieldWrapper title={title} error={errorMessage} helperText={helperText}>
        <input
          autoComplete={autoComplete}
          placeholder={title}
          {...register(fieldName, options)}
          type="number"
          step={step}
          className={
            "relative block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 font-normal text-gray-600 placeholder-gray-500 focus:z-10 focus:border-brand-pink focus:outline-none focus:ring-brand-pink sm:text-sm" +
            className
          }
        />
        {postInput}
      </FieldWrapper>
    );
  }

  if (type === "email") {
    return (
      <FieldWrapper title={title} error={errorMessage} helperText={helperText}>
        <input
          autoComplete={autoComplete}
          placeholder={title}
          {...register(fieldName, options)}
          type="email"
          className={
            "relative block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 font-normal text-gray-600 placeholder-gray-500 focus:z-10 focus:border-brand-pink focus:outline-none focus:ring-brand-pink sm:text-sm" +
            className
          }
        />
        {postInput}
      </FieldWrapper>
    );
  }

  // default to a text input
  return (
    <FieldWrapper title={title} error={errorMessage} helperText={helperText}>
      <input
        autoComplete={autoComplete}
        placeholder={title}
        {...register(fieldName, options)}
        type="text"
        className={
          "relative block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 font-normal text-gray-600 placeholder-gray-500 focus:z-10 focus:border-brand-pink focus:outline-none focus:ring-brand-pink sm:text-sm" +
          className
        }
      />
      {postInput}
    </FieldWrapper>
  );
};
