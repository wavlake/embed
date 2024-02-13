import BoostBareIcon from "../icons/BOOST-BARE.svg";
import { Dialog, Transition } from "@headlessui/react";
import { DuplicateIcon } from "@heroicons/react/outline";
import Image from "next/image";
import QRCode from "qrcode";
import { Fragment, useEffect, useState } from "react";

async function generateQR(text) {
  if (text) {
    try {
      return QRCode.toDataURL(text)
        .then((url) => url)
        .catch((err) => {
          console.error(err);
        });
    } catch (e) {
      console.log(e);
    }
  }
}

async function copyTextToClipboard(text) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export default function FundingInvoiceModal(props) {
  const [isCopied, setIsCopied] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [payDisplay, setPayDisplay] = useState(true);

  const { reset, isInvoiceOpen, setIsInvoiceOpen, paymentRequest } = props;

  useEffect(() => {
    generateQR(paymentRequest).then((img) => setQrImage(img));
  }, [paymentRequest]);

  function closeModal() {
    setIsInvoiceOpen(false);
    setIsCopied(false);
    // setPayDisplay(true);
    reset();
  }

  return (
    <Transition appear show={isInvoiceOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={closeModal}>
        <div className="z-20 mx-auto w-full max-w-xl rounded-xl border border-brand-pink bg-brand-black py-2">
          <div className="m-2 flex justify-center">
            <Image src={qrImage} height={200} width={200} />
          </div>
          <div className="m-2">
            <textarea
              readOnly={true}
              className="whitespace-wrap w-full resize-none overflow-hidden rounded-2xl text-sm text-slate-600"
              value={paymentRequest}
            />
          </div>

          <div className="mx-2 mt-4 flex items-center justify-between">
            <div
              className="group grid grid-cols-1 items-center justify-items-center"
              onClick={() => {
                copyTextToClipboard(`${paymentRequest}`).then(
                  setIsCopied(true)
                );
              }}
            >
              <div className="group flex items-center group-hover:cursor-pointer">
                <DuplicateIcon
                  className={`${
                    isCopied ? "text-brand-pink" : "text-white"
                  } h-7 group-hover:text-brand-black-light`}
                />
                <p className="flex w-4 text-xs tracking-tight text-white group-hover:text-brand-black-light">
                  {isCopied ? "Copied" : "Copy"}
                </p>
              </div>
            </div>
            <a href={`lightning:${paymentRequest}`}>
              <button
                type="button"
                className={`${
                  payDisplay ? "flex" : "hidden"
                } flex items-center justify-center px-5 py-1 text-sm font-semibold tracking-wide text-white`}
                // onClick={() => setPayDisplay(true)}
              >
                <BoostBareIcon className="-ml-2 flex h-5 fill-brand-pink" />
                Pay
              </button>
            </a>
            <button
              type="button"
              className="flex items-center rounded-md border border-white px-2 py-1.5 text-xs tracking-tighter text-white hover:bg-brand-black-light"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
