import { NostrProvider } from "nostr-react";
import "../../styles/globals.css";

const RELAY = process.env.NEXT_PUBLIC_WAVLAKE_RELAY_URL;

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <NostrProvider relayUrls={[RELAY]} debug={true}>
      <Component {...pageProps} />
    </NostrProvider>
  );
}
