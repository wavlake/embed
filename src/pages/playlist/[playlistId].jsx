import EmbedPlayer from "../../components/embedPlayer";

const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;

export async function getServerSideProps(context) {
  const { playlistId } = context.params;
  const queryString = context.resolvedUrl.split("?")[1];

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

  return { props: { trackData: data } };
}

export default function Embed(props) {
  const { trackData } = props;

  return <EmbedPlayer trackData={trackData} />;
}
