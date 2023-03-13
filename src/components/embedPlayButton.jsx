import PlayIcon from './../icons/play.svg'
import PauseIcon from './../icons/pause.svg'

export default function EmbedPlayButton(props) {
  
  const {
    isPlaying,
  } = props

  return (
    <div 
        className='mr-2 h-7 flex items-center space-x-1 bg-brand-pink tracking-tight font-semibold p-2 rounded-full cursor-pointer hover:bg-brand-pink-light'
      >
      { isPlaying ? 
      (
        <PauseIcon 
          className="flex h-3 fill-brand-black"
          />
      )
      :
      (
        <PlayIcon 
          className={`flex h-3 fill-brand-black`}
          />
      )}
    </div>
  )
}