import EmbedPlayer from "../../components/embedPlayer";
import catalogClient from "../../utils/catalogClient";

const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;

export async function getServerSideProps(context) {
  const { playlistId } = context.params;
  const queryString = context.resolvedUrl.split("?")[1];
  const showSats = queryString ? queryString.includes("sort=sats") : false;

  const data = await catalogClient
    // Query params located in second index of split array
    .get(`/playlists/${playlistId}?${queryString}`)
    .then(({ data }) => {
      return data.data;
    })
    .catch(({ err }) => {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    });

  return { props: { trackData: data, showSats: showSats } };
}

export default function Embed(props) {
  const { trackData, showSats } = props;

  return <EmbedPlayer trackData={trackData} showSats={showSats} />;
}
