import axios from "axios";

const apiProtocol = process.env.NEXT_PUBLIC_WAVLAKE_PROTOCOL
const apiHost = process.env.NEXT_PUBLIC_WAVLAKE_HOST
const apiPort = process.env.NEXT_PUBLIC_WAVLAKE_PORT
const wavlakeApi = `${apiProtocol}://${apiHost}:${apiPort}`

export default axios.create({
  baseURL: wavlakeApi,
});