import Layout from "../components/layout";

export default function Home(props) {
  return <></>;
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
