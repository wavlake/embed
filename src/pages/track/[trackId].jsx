import EmbedPlayer from "../../components/embedPlayer";
import catalogClient from "../../utils/catalogClient";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const { trackId } = context.params;

  const track = await catalogClient
    .get(`/tracks/${trackId}`)
    .then(({ data }) => data?.data ?? null)
    .catch(() => null);

  if (!track) {
    // Short revalidate so newly published content isn't 404'd for an hour.
    return { notFound: true, revalidate: 60 };
  }

  return { props: { trackData: [track] }, revalidate: 3600 };
}

export default function Embed(props) {
  const { trackData } = props;

  return <EmbedPlayer trackData={trackData} />;
}
