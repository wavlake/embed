import applyRateLimit from "../../utils/limiter";
import serverClient from "../../utils/serverClient";

export default async function handler(req, res) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }

  await serverClient
    .get(`/ln/check-amp-invoice?paymentHash=${req.query.paymentHash}`)
    .then(({ data }) => {
      res.status(200).json(data);
    })
    .catch(({ err }) => {
      res.status(400).json({ err });
    });
}
