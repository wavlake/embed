import EmbedPlayer from "../../components/embedPlayer";
import { GetStaticPaths, GetStaticProps } from "next";
import { EmbedProps } from "../../utils/commonTypes";

const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps<EmbedProps> = async (context) => {
  const { trackId } = context.params;

  const result = await fetch(`${domain}/api/track?trackId=${trackId}`);

  const data = await result.json();

  console.log({data})
  return { props: { trackData: data } };
}

export default function Embed(props: EmbedProps) {
  const { trackData } = props;

  return <EmbedPlayer trackData={trackData} />;
}
