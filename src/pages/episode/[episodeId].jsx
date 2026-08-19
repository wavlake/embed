import EmbedPlayer from "../../components/embedPlayer";
import catalogClient from "../../utils/catalogClient";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const { episodeId } = context.params;

  const episode = await catalogClient
    .get(`/episodes/${episodeId}`)
    .then(({ data }) => data?.data ?? null)
    .catch(() => null);

  if (!episode) {
    return { notFound: true, revalidate: 60 };
  }

  return { props: { trackData: [episode] }, revalidate: 3600 };
}

export default function Embed(props) {
  const { trackData } = props;

  return <EmbedPlayer trackData={trackData} />;
}
