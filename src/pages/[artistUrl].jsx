import EmbedPlayer from "../components/embedPlayer";
import NoExist from "../components/noExist";

const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;
const nodeId = process.env.NEXT_WAVLAKE_PUBLIC_NODE_ID;

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

  return { props: { trackData: data, nodeId } };
}

export default function Embed(props) {
  // const router = useRouter()
  // const { trackId } = router.query
  const { trackData, nodeId } = props;

  return (
    <>
      {trackData ? (
        <EmbedPlayer trackData={trackData} nodeId={nodeId} />
      ) : (
        <NoExist />
      )}
    </>
  );
}
