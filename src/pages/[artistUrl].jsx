import EmbedPlayer from "../components/embedPlayer";
import catalogClient from "../utils/catalogClient";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const { artistUrl } = context.params;

  const artistId = await catalogClient
    .get(`/artists/${artistUrl}/url`)
    .then(({ data }) => data?.data?.id ?? null)
    .catch(() => null);

  if (!artistId) {
    return { notFound: true, revalidate: 60 };
  }

  const topTracks = await catalogClient
    .get(`/artists/${artistId}`)
    .then(({ data }) => data?.data?.topTracks ?? null)
    .catch(() => null);

  if (!topTracks?.length) {
    return { notFound: true, revalidate: 60 };
  }

  return { props: { trackData: topTracks }, revalidate: 3600 };
}

export default function Embed(props) {
  const { trackData } = props;

  return <EmbedPlayer trackData={trackData} />;
}
