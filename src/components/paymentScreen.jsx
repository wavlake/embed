import BoostBareIcon from "../icons/BOOST-BARE.svg";
import { QRCode } from "./qrCode";

const PayButton = ({ paymentRequest }) => {
  return (
    <a
      href={`lightning:${paymentRequest}`}
      className="flex items-center hover:text-gray-300"
    >
      <BoostBareIcon className="-ml-2 flex h-5 fill-brand-pink" />
      Click to pay with wallet
    </a>
  );
};

export const PaymentScreen = ({ paymentRequest, setPaymentRequest }) => {
  return (
    <div className="flex flex-grow flex-col items-center gap-4">
      <QRCode text={paymentRequest} size={200} />
      <PayButton paymentRequest={paymentRequest} />
      <button
        className="hover:text-gray-300"
        onClick={() => setPaymentRequest("")}
      >
        Cancel
      </button>
    </div>
  );
};
