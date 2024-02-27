import EmbedPlayer from "../../components/embedPlayer";
import catalogClient from "../../utils/catalogClient";

export async function getServerSideProps(context) {
  const { podcastUrl } = context.params;

  const podcastId = await catalogClient
    .get(`/podcasts/${podcastUrl}/url`)
    .then(({ data }) => {
      return data?.data?.id;
    })
    .catch(({ err }) => {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    });

  const data = await catalogClient
    .get(`/episodes/${podcastId}/podcast`)
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

  return { props: { trackData: data } };
}

export default function Embed(props) {
  const { trackData } = props;

  return <EmbedPlayer trackData={trackData} showSats={false} />;
}
