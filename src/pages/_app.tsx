import "../../styles/globals.css";
import type { NextComponentType } from "next";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import { ReactNode } from "react";

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps,
}: AppLayoutProps) => {
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return getLayout(<Component {...pageProps} />);
};

export default MyApp;
