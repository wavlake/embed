import apiClient from "../../utils/apiClient";
import applyRateLimit from "../../utils/limiter";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }

  await apiClient
    .get(`/ln/check-amp-invoice?paymentHash=${req.query.paymentHash}`)
    .then(({ data }) => {
      res.status(200).json(data);
    })
    .catch(({ err }) => {
      res.status(400).json({ err });
    });
}
