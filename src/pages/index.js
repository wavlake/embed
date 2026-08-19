// The root of the embed domain has no content of its own — send visitors
// to the main site. Temporary (307) so a future homepage isn't fighting
// cached permanent redirects.
export async function getServerSideProps() {
  return {
    redirect: {
      destination: "https://wavlake.com",
      permanent: false,
    },
  };
}

export default function Home() {
  return null;
}
