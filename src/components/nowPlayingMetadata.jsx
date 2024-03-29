import LogoIcon from "../icons/LOGO.svg";
import Image from "next/image";

const shareUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

const contentLink = (isTrack, id) => {
  if (isTrack) {
    return `${shareUrl}/track/${id}`;
  } else {
    return `${shareUrl}/episode/${id}`;
  }
};

const parentContentLink = (isTrack, id) => {
  if (isTrack) {
    return `${shareUrl}/${id}`;
  } else {
    return `${shareUrl}/podcast/${id}`;
  }
};

export const NowPlayingMetadata = ({ activeContent }) => {
  return (
    // translate-y by -5px so the text aligns with the album art
    <div className="flex grow translate-y-[-4px] flex-col">
      <a
        href={contentLink(
          activeContent.podcast === undefined,
          activeContent.id
        )}
        target={"_blank"}
        rel={"noreferrer"}
        className="text-md max-w-fit font-semibold hover:text-gray-400"
      >
        {activeContent.title}
      </a>
      <a
        className="max-w-fit text-sm underline hover:text-gray-400"
        href={parentContentLink(
          activeContent.podcast === undefined,
          activeContent.artistUrl ||
            activeContent.podcast?.podcastUrl ||
            activeContent.podcastUrl
        )}
        target={"_blank"}
        rel={"noreferrer"}
      >
        {activeContent.artist ||
          activeContent.podcast?.name ||
          activeContent.podcast}
      </a>
    </div>
  );
};

export const Logo = ({ activeContent }) => {
  return (
    <a
      href={contentLink(activeContent.podcast === undefined, activeContent.id)}
      target={"_blank"}
      rel={"noreferrer"}
      className="w-10"
    >
      <LogoIcon
        className="h-7 w-10 fill-white hover:fill-gray-400"
        viewBox="0 0 1200 1200"
      />
    </a>
  );
};

export const NowPlayingAlbumArt = ({ activeContent, isSingle }) => {
  return (
    <a
      href={contentLink(activeContent.podcast === undefined, activeContent.id)}
      target={"_blank"}
      rel={"noreferrer"}
      className="pb-3 hover:opacity-80"
    >
      <Image
        src={activeContent.artworkUrl || activeContent.podcast?.artworkUrl}
        width={isSingle ? 250 : 70}
        height={isSingle ? 250 : 70}
      />
    </a>
  );
};
