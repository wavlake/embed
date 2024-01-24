import apiClient from "../../utils/apiClient";

export default async function handler(req, res) {
  await apiClient
    .get(`/tracks/${req.query.albumId}/album`)
    .then(({ data }) => {
      res.status(200).json(data.data);
    })
    .catch(({ err }) => {
      res.status(400).json({ err });
    });
}
