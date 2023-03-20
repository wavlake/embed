// Adapted from: https://kittygiraudel.com/2022/05/16/rate-limit-nextjs-api-routes/
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const applyMiddleware = (middleware) => (request, response) =>
  new Promise((resolve, reject) => {
    middleware(request, response, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });

const getIP = (request) =>
  request.ip ||
  request.headers["x-forwarded-for"] ||
  request.headers["x-real-ip"] ||
  request.connection.remoteAddress;

export const getRateLimitMiddlewares = ({
  limit = 7,
  windowMs = 60 * 1000,
  delayAfter = Math.round(limit / 2),
  delayMs = 1000,
} = {}) => [
  slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
  // Geoblocking middleware function
  async (req, res, next) => {
    if (
      ["CU", "IR", "KP", "RU", "SY"].includes(
        req.headers["x-vercel-ip-country"]
      )
    ) {
      res.status(500);
      res.json({ error: err });
    } else {
      next();
    }
  },
];

const middlewares = getRateLimitMiddlewares();

async function applyRateLimit(request, response) {
  await Promise.all(
    middlewares
      .map(applyMiddleware)
      .map((middleware) => middleware(request, response))
  );
}

export default applyRateLimit;
