import catalogClient from "../../utils/catalogClient";

export default async function handler(req, res) {
  await catalogClient
    .get(`/playlists/${req.query.playlist}`)
    .then(({ data }) => {
      res.status(200).json(data.data);
    })
    .catch(({ err }) => {
      res.status(400).json({ err });
    });
}
