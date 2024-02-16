import EmbedPlayer from "../components/embedPlayer";

const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;

export async function getServerSideProps(context) {
  const { query } = context;
  const queryString = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join("&");

  const result = await fetch(`${domain}/api/chart?${queryString}`);

  const data = await result.json();

  return { props: { trackData: data } };
}

export default function Embed(props) {
  const { trackData } = props;

  return <EmbedPlayer trackData={trackData} />;
}
