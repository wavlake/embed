import catalogClient from "../../utils/catalogClient";

export default async function handler(req, res) {
  console.log(req.url);
  await catalogClient
    // Query params located in second index of split array
    .get(
      `/playlists/${req.query.playlist.split("?")[0]}?${req.url.split("?")[2]}`
    )
    .then(({ data }) => {
      res.status(200).json(data.data);
    })
    .catch(({ err }) => {
      res.status(400).json({ err });
    });
}
