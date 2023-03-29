import Layout from "../components/layout";
import { ReactElement } from "react";

export default function Home(props) {
  return <></>;
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
