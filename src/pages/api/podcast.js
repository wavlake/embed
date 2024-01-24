import apiClient from "../../utils/apiClient";

export default async function handler(req, res) {
  const podcastId = await apiClient
    .get(`/podcasts/${req.query.podcastUrl}/url`)
    .then(({ data }) => {
      if (!data?.data?.id) {
        return res.status(404).json({ err: "Podcast not found" });
      } else if (data?.data?.id) {
        return data.data.id;
      }
    })
    .catch(({ err }) => {
      res.status(400).json({ err });
    });

  await apiClient
    .get(`/episodes/${podcastId}/podcast`)
    .then(({ data }) => {
      res.status(200).json(data);
    })
    .catch(({ err }) => {
      res.status(400).json({ err });
    });
}
