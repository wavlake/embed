export default function WavGraphic() {
  return (
    <div className="flex">
      <span className="stroke bg-size-200 relative z-20 block h-12 w-3 animate-sweep-up rounded-b-3xl bg-gradient-to-t from-brand-pink to-brand-pink-light" />
      <span className="stroke relative z-20 mt-3 ml-wav block h-9 w-3 animate-sweep-up rounded-b-3xl bg-gradient-to-t from-brand-pink to-brand-pink-light" />
      <span className="stroke relative z-20 mt-2 block h-11 w-3 rotate-wav -skew-y-wav animate-sweep-up rounded-b-3xl bg-gradient-to-t from-brand-pink to-brand-pink-light" />
    </div>
  );
}
