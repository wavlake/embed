import { ReactElement } from 'react'
import Layout from "../components/layout";

export default function Home(props) {
  return <></>;
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
