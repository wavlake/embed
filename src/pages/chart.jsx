import EmbedPlayer from "../components/embedPlayer";

const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;

export async function getServerSideProps(context) {
  const { query } = context;
  const queryString = context.resolvedUrl.split("?")[1];
  const showSats = context.resolvedUrl.includes("sort=sats");

  const result = await fetch(`${domain}/api/chart?${queryString}`);

  const data = await result.json();

  if (!data) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { trackData: data, showSats: showSats } };
}

export default function Embed(props) {
  const { trackData, showSats } = props;

  return <EmbedPlayer trackData={trackData} showSats={showSats} />;
}
