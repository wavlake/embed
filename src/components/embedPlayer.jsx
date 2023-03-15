import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import EmbedPlayButton from "./embedPlayButton"
import EmbedForwardButton from "./embedForwardButton"
import ReactPlayer from 'react-player'
import BoostIcon from '../icons/BOOST.svg'
import LogoIcon from '../icons/LOGO.svg'
import { useForm } from "react-hook-form";
import { Transition } from '@headlessui/react'
import FundingInvoiceModal from "./fundingInvoiceModal"

const shareUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;

export default function EmbedPlayer(props) {
    
    const ref = useRef(null);

    // Hydration fix for ReactPlayer & React 18
    const [ hasWindow, setHasWindow ] = useState(false);
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ trackProgress, setTrackProgress ] = useState(0)
    const [ viewForm, setViewForm ] = useState(false)
    const [ successMessage, setSuccessMessage ] = useState('')
    const [ webLnAvailable, setWebLnAvailable ] = useState(true)
    const [ width, setWidth ] = useState(0);
    const [ paymentRequest, setPaymentRequest ] = useState('')
    const [ isInvoiceOpen, setIsInvoiceOpen ] = useState(false);

    const [ currentTrackIndex, setCurrentTrackIndex ] = useState(0)

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
    useEffect(() => {
      if (typeof window != "undefined") {
        setHasWindow(true);
      }
      if (typeof window.webln === 'undefined') {
        setWebLnAvailable(false)
      }
      setWidth(ref.current.offsetWidth);
    }, []);

    const {
        trackData,
        nodeId
      } = props

    const trackDataLength = trackData.length - 1

    async function handleBoost(data) {

      try {

        const result = await fetch(`${domain}/api/invoice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        
        const resultJson = await result.json()

        const paymentRequest = resultJson.payment_request

        if (webLnAvailable) {

          try {
            await webln.enable();
            const result = await window.webln.sendPayment(paymentRequest)
            if (result.preimage) {
              setSuccessMessage(`Boosted ${data.amount} sats!`)
              setViewForm(false)
              reset();
            }
          } catch(err) {
            alert(err);
          }
        }

        else {
          setPaymentRequest(paymentRequest)
          setIsInvoiceOpen(true)
          return;
        }

      } catch(e) {
        console.error(e)
      }

      
    }

    return(
        <>
        { trackData && (
        <div>
          <div className='absolute w-full'>
            <FundingInvoiceModal 
              reset={reset}
              isInvoiceOpen={isInvoiceOpen}
              setIsInvoiceOpen={setIsInvoiceOpen}
              paymentRequest={paymentRequest}
            />
          </div>
          <div
            className="max-w-xl grid grid-cols-1 grid-rows-3 bg-brand-black space-x-1 -space-y-1 rounded-xl"
          >
            {/* IMAGE CONTAINER */}
            <div
              className="row-span-2 px-2 flex justify-start mx-auto my-auto"  
            >
              <Image 
                src={trackData[currentTrackIndex].artworkUrl}
                width={220}
                height={220}
              />
            </div>

            {/* TRACK METADATA & CONTROLS */}
            <div
              className="row-span-1 grid grid-rows-2 px-2"  
            >
              {/* ROW 1 */}
              <div className="row-span-1 text-white tracking-tighter mt-1">
                <a
                    href={`${shareUrl}/track/${trackData[currentTrackIndex].id}`}
                    target={'_blank'}
                    rel={'noreferrer'}
                    className="flex items-center"
                  >
                <p className="font-semibold text-sm">{trackData[currentTrackIndex].title}</p>
                </a>
                <p className="flex text-xs mt-1">by {trackData[currentTrackIndex].artist}</p>
                {/* PROGRESS BAR */}
                <div 
                  className="border-b-2 border-brand-pink my-2"
                  ref={ref}
                />
                {/* Overlay */}
                <div 
                  className="relative -translate-y-2.5 z-10 border-b-2 border-brand-pink-dark"
                  style={{ width: `${trackProgress}%`, 
                          transitionProperty: "width",
                          transitionDuration: "0.5s",
                          transitionTimingFunction: "linear", 
                        }}
                />
              </div>


              {/* ROW 2 */}
              <div className="row-span-1 grid grid-cols-7 items-center">
                <div
                  className="flex col-span-2 justify-self-start items-center"
                  >
                  <div onClick={ () => setIsPlaying(!isPlaying) }>
                  <EmbedPlayButton
                    isPlaying={isPlaying}
                  />
                  </div>
                  { trackData.length > 1 &&
                  <div onClick={ () => { if (currentTrackIndex < trackDataLength) { setCurrentTrackIndex(currentTrackIndex + 1) }} }>
                    <EmbedForwardButton 
                    />      
                  </div>            
                  }
                </div>
                <Transition
                  show={viewForm}
                  enter="transition-opacity duration-200"
                  enterFrom="opacity-0 -translate-x-20"
                  enterTo="opacity-100"
                  className="col-span-3"
                >
                <div className=''>
                  <form 
                    className="flex items-center"
                    onSubmit={ handleSubmit(data => handleBoost({ ...data, trackId: trackData[currentTrackIndex].id})) }
                  >
                    <input
                      className="flex w-10 text-sm tracking-tight rounded-md px-2 focus:accent-brand-pink"
                      defaultValue="1"
                      { ...register("amount",
                                    { required: true,
                                      pattern: /[1234567890]/ }
                                    )} />
                    {errors.amount && <span className="flex text-red-700 text-xs">Required</span>}
                    <p className="flex ml-1 text-xs tracking-tight text-white">sats</p>
                    <button
                      type='submit'
                    >
                      <BoostIcon 
                        className="fill-brand-pink h-9 hover:fill-brand-pink-light cursor-pointer"
                      />
                    </button>
                  </form>
                  </div>
                </Transition>
                <div
                  className={`${ !viewForm ? 'flex col-span-3' : 'hidden'}`}
                  onClick={ () => setViewForm(!viewForm) }
                >
                  <BoostIcon 
                    className='fill-brand-black-light h-9 hover:fill-brand-pink-light cursor-pointer'
                  />
                </div>
                <div className="flex col-span-2 justify-self-end cursor-pointer">
                  <a
                    href={`${shareUrl}/track/${trackData[currentTrackIndex].id}`}
                    target={'_blank'}
                    rel={'noreferrer'}
                  >
                    <LogoIcon className="flex h-8 fill-white" />
                  </a>
                </div>
                <Transition
                  show={!viewForm}
                  enter="transition-opacity duration-200"
                  enterFrom="opacity-0 translate-x-20"
                  enterTo="opacity-100"
                >
                  <div className="flex italic text-xs text-white tracking-tighter whitespace-nowrap">
                    <p>{successMessage}</p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
        )
      }
      { hasWindow &&
          <ReactPlayer
            controls={false}
            url={trackData[currentTrackIndex].liveUrl}
            playing={isPlaying}
            height="0"
            width="0"
            onProgress={(progress) => { setTrackProgress(progress.played * 100) }}
          />
      }
      </>
    )

}