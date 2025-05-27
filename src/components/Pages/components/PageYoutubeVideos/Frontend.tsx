import { PageYoutubeVideo } from '../../../../payload-types'

function getYouTubeVideoId(url: string) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null // Return the video ID or null if no match
}

function PageYoutubesVideoComponent({
  pageYoutubeVideo,
}: {
  pageYoutubeVideo: PageYoutubeVideo | string
}) {
  // sollte eigentlich nicht relevant
  if (typeof pageYoutubeVideo === 'string') {
    return
  }

  return (
    <div className="shadow-sm rounded-xl w-full text-lg p-4 bg-white text-slate-600 aspect-video relative overflow-hidden">
      <iframe
        src={'https://www.youtube.com/embed/' + getYouTubeVideoId(pageYoutubeVideo.url)}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      ></iframe>
    </div>
  )
}

export default PageYoutubesVideoComponent
