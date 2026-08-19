import EmbedPlayer from "../../components/embedPlayer";
import catalogClient from "../../utils/catalogClient";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const { albumId } = context.params;

  const tracks = await catalogClient
    .get(`/tracks/${albumId}/album`)
    .then(({ data }) => data?.data ?? null)
    .catch(() => null);

  if (!tracks?.length) {
    return { notFound: true, revalidate: 60 };
  }

  return { props: { trackData: tracks, showSats: false }, revalidate: 3600 };
}

export default function Embed(props) {
  const { trackData, showSats } = props;

  return <EmbedPlayer trackData={trackData} showSats={showSats} />;
}
