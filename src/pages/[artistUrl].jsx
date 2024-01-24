import EmbedPlayer from "../components/embedPlayer";

const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const { artistUrl } = context.params;

  const result = await fetch(`${domain}/api/artist?artistUrl=${artistUrl}`);

  const data = await result.json();

  return { props: { trackData: data?.data?.topTracks } };
}

export default function Embed(props) {
  const { trackData } = props;

  return <EmbedPlayer trackData={trackData} />;
}
