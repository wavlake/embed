import EmbedPlayer from "../../components/embedPlayer";

const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;

export async function getServerSideProps(context) {
  console.log(context);
  const { playlistId } = context.params;
  const { sort, startDate, endDate } = context.query;
  const queryString = `sort=${sort}&startDate=${startDate}&endDate=${endDate}`;
  const showSats = sort ? sort.includes("sats") : false;

  const result = await fetch(
    `${domain}/api/playlist?playlist=${playlistId}?${queryString}`
  );

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
