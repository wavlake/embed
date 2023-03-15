import { FastForwardIcon } from '@heroicons/react/solid'

export default function EmbedForwardButton(props) {
  
  const {
    isPlaying,
  } = props

  return (
    <div 
        className='h-7 flex items-center space-x-1 bg-brand-black-light tracking-tight font-semibold p-2 rounded-full cursor-pointer hover:bg-brand-pink-light'
      >
        <FastForwardIcon 
          className="flex w-3 fill-brand-black"
          />
    </div>
  )
}