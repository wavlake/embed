import { Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { DuplicateIcon } from '@heroicons/react/outline'
import BoostBareIcon from '../icons/BOOST-BARE.svg'
import Image from 'next/image'
import QRCode from 'qrcode';

async function generateQR(text) {
  try {
    return QRCode.toDataURL(text)
        .then(url => url)
        .catch(err => {
          console.error(err)
        })
  } catch(e) {
    console.log(e)
  }
}

async function copyTextToClipboard(text) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

export default function FundingInvoiceModal(props) {

  const [ isCopied, setIsCopied ] = useState(false)
  const [ qrImage, setQrImage ] = useState('')

  const {
    reset,
    isInvoiceOpen,
    setIsInvoiceOpen,
    paymentRequest,
  } = props

  useEffect(() => {
    generateQR(paymentRequest)
      .then(img => setQrImage(img))
  }, [paymentRequest]);


  function closeModal() {
    setIsInvoiceOpen(false);
    setIsCopied(false);
    reset();
  }

  return (
    <Transition
      as={Fragment}
      show={isInvoiceOpen}
      enter="transform transition duration-[400ms]"
      enterFrom="opacity-0 scale-50"
      enterTo="opacity-100 scale-100"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 scale-100 "
      leaveTo="opacity-0 scale-95 "
    >
    <div className='absolute z-10 bg-brand-black py-2 my-8 mx-2 border-brand-pink border rounded-xl'>
      <div
        className="flex m-2 justify-center">
        <Image 
          src={qrImage}
          height={200}
          width={200}
        />
      </div>
      <div className="m-2">
        <textarea 
          readOnly={true}
          className="text-sm overflow-hidden resize-none whitespace-wrap w-full rounded-2xl text-slate-600"
          value={paymentRequest}
          />
      </div>

      <div className="flex items-center justify-between mt-4 mx-2">
        <div 
          className="grid grid-cols-1 items-center justify-items-center group"
          onClick={() => { copyTextToClipboard(`${paymentRequest}`)
          .then(setIsCopied(true)) } }>
          <DuplicateIcon
              className={`${isCopied ? 'text-brand-pink' : 'text-white group-hover:text-brand-black-light'} h-7 transition cursor-pointer`}>
          </DuplicateIcon>
        </div>
        <a href={`lightning:${paymentRequest}`}>
          <button
            type="button"
            className="flex justify-center items-center rounded-md border border-white px-5 py-1 text-sm font-semibold text-white tracking-wide hover:bg-brand-black-light" 
          >
            <BoostBareIcon className="flex h-5 -ml-1 fill-brand-pink"/>
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
    </Transition>
  )
}