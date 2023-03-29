import EmbedPlayer from "../../components/embedPlayer";
import { EmbedProps } from "../../utils/commonTypes";
import { GetStaticPaths, GetStaticProps } from "next";

const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<EmbedProps> = async (context) => {
  const { albumId } = context.params;

  const result = await fetch(`${domain}/api/album?albumId=${albumId}`);

  const data = await result.json();

  return { props: { trackData: data } };
};

export default function Embed(props: EmbedProps) {
  const { trackData } = props;

  return <EmbedPlayer trackData={trackData} />;
}
