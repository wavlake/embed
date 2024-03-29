import catalogClient from "../../utils/catalogClient";

export default async function handler(req, res) {
  const artistId = await catalogClient
    .get(`/artists/${req.query.artistUrl}/url`)
    .then(({ data }) => {
      if (!data?.data?.id) {
        return res.status(404).json({ err: "Artist not found" });
      } else if (data?.data?.id) {
        return data.data.id;
      }
    })
    .catch(({ err }) => {
      res.status(400).json({ err });
    });

  await catalogClient
    .get(`/artists/${artistId}`)
    .then(({ data }) => {
      res.status(200).json(data);
    })
    .catch(({ err }) => {
      res.status(400).json({ err });
    });
}
