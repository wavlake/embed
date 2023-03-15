import apiClient from "../../utils/apiClient";
import applyRateLimit from "../../utils/limiter";
import { resolve } from "styled-jsx/css";

export default async function handler(req, res) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }

  await apiClient
    .post(`/ln/generate-amp-invoice`, req.body)
    .then(({ data }) => {
      // console.log(data)
      res.status(200).json(data);
    })
    .catch(({ err }) => {
      res.status(400).json({ err });
    });
}
