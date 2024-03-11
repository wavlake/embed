import EmbedPlayer from "../../components/embedPlayer";
import catalogClient from "../../utils/catalogClient";

export async function getServerSideProps(context) {
  const { playlistId } = context.params;
  const queryString = context.resolvedUrl.split("?")[1];
  const showSats = queryString ? queryString.includes("sort=sats") : false;

  const data = await catalogClient
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

  if (!data) {
    return {
      notFound: true,
    };
  }

  return { props: { trackData: data.tracks, showSats: showSats } };
}

export default function Embed(props) {
  const { trackData, showSats } = props;

  return <EmbedPlayer trackData={trackData} showSats={showSats} />;
}
