import axios from "axios";

const apiProtocol = process.env.NEXT_PUBLIC_CATALOG_PROTOCOL;
const apiHost = process.env.NEXT_PUBLIC_CATALOG_HOST;
const apiPort = process.env.NEXT_PUBLIC_CATALOG_PORT;
const wavlakeApi = `${apiProtocol}://${apiHost}:${apiPort}/v1`;

export default axios.create({
  baseURL: wavlakeApi,
});
