import { DefaultSeo } from "next-seo";
import ErrorBoundary from "../components/errorBoundary";

export default function Layout({ children }) {
  return (
    <>
      <DefaultSeo
        title="Wavlake • Player"
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "https://wavlake.com/",
          siteName: "Wavlake • Player",
          description: "Turn up the value ⚡️",
          images: [
            {
              url: "https://firebasestorage.googleapis.com/v0/b/wavlake-alpha.appspot.com/o/assets%2FSocial%20Square%20Icon.png?alt=media&token=106b2ff3-11d6-4e20-a0a4-2ecaa0db92ce",
              width: 500,
              height: 500,
              alt: "Wavlake logo alt",
              type: "image/jpeg",
            },
          ],
        }}
        twitter={{
          site: "@wavlake",
          cardType: "summary_large_image",
        }}
      />
      <ErrorBoundary>
        <main>{children}</main>
      </ErrorBoundary>
    </>
  );
}
