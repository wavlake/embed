import EmbedPlayer from "../../components/embedPlayer";

const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const { albumId } = context.params;

  const result = await fetch(`${domain}/api/album?albumId=${albumId}`);

  const data = await result.json();

  return { props: { trackData: data } };
}

export default function Embed(props) {
  const { trackData } = props;

  return <EmbedPlayer trackData={trackData} showSats={false} />;
}
