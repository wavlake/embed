import { hexToBytes } from "@noble/hashes/utils";
import { getPublicKey, finalizeEvent } from "nostr-tools";

const lnUrlDomain = process.env.NEXT_PUBLIC_LNURL_DOMAIN;
const relayUrl = process.env.NEXT_PUBLIC_RELAY_URL;

export const getZapRequestInvoice = async ({
  trackId,
  satAmount: amount,
  content,
  timestamp,
  randomSecret,
  metadata,
}) => {
  try {
    const lnurl = `${lnUrlDomain}/.well-known/lnurlp/zap`;

    const { allowsNostr, callback, nostrPubkey, error } = await fetchLNURLInfo(
      lnurl
    );

    if (error || !nostrPubkey || !callback || !allowsNostr) {
      console.error(error);
      return;
    }

    try {
      const signedZapEvent = await signZapEventWithRandom({
        content,
        amount,
        lnurl,
        recepientPubKey: nostrPubkey,
        trackId,
        pubkey: getPublicKey(hexToBytes(randomSecret)),
        timestamp,
        randomSecret,
      });

      if (!signedZapEvent) {
        throw "failed to sign event";
      }

      return sendZapRequestReceivePaymentRequest({
        signedZapEvent,
        callback,
        amount,
        lnurl,
        metadata,
      });
    } catch (e) {
      console.error("Error signing zap:", e);
    }
  } catch (err) {
    console.log("Error getting invoice", { err, trackId });
  }
};

const fetchLNURLInfo = async (lnurl) => {
  try {
    const res = await fetch(lnurl);
    const {
      allowsNostr,
      callback,
      maxSendable,
      metadata,
      minSendable,
      nostrPubkey,
      tag,
    } = await res.json();

    if (!validateNostrPubKey(nostrPubkey)) {
      throw `Invalid nostr pubkey ${nostrPubkey}`;
    }
    if (!allowsNostr) {
      throw "lnurl does not allow nostr";
    }

    return { allowsNostr, callback, nostrPubkey };
  } catch (err) {
    console.error("Error fetching lnurl info", { err, lnurl });
    return { error: "Error fetching lnurl info" };
  }
};

const signZapEventWithRandom = async ({
  content,
  amount,
  lnurl,
  recepientPubKey,
  trackId,
  pubkey,
  timestamp,
  randomSecret,
}) => {
  let event = {
    kind: 9734,
    content: content ?? "",
    pubkey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["relays", "wss://relay.wavlake.com/"],
      ["amount", sats2millisats(amount).toString()],
      ["lnurl", lnurl],
      ["p", recepientPubKey],
      // ["e", zappedEventId],
      [
        "a",
        `32123:${recepientPubKey}:${trackId}`,
        ...(relayUrl ? [relayUrl] : []),
      ],
      ...(timestamp ? [["timestamp", timestamp.toString()]] : []),
    ],
  };

  const signedEvent = finalizeEvent(event, hexToBytes(randomSecret));
  return signedEvent;
};

export const sendZapRequestReceivePaymentRequest = async ({
  signedZapEvent,
  callback,
  amount,
  lnurl,
  metadata, // for LNURL verification only
}) => {
  // https://github.com/nostr-protocol/nips/blob/master/57.md#appendix-b-zap-request-http-request
  const event = JSON.stringify(signedZapEvent);
  const params = {
    amount: sats2millisats(amount).toString(),
    nostr: event,
    lnurl: lnurl,
    ...(metadata && { metadata: metadata }),
  };
  const queryParams = new URLSearchParams(params).toString();
  const url = `${callback}?${queryParams}`;

  const paymentRequestRes = await fetch(url);
  // zap is in the memo of the invoice
  const { request } = await paymentRequestRes.json();

  if (!request) {
    console.error({ callback, lnurl, signedZapEvent });
    throw "Error fetching payment request";
  }
  return request;
};

const chopDecimal = (amount) => Math.floor(amount);
export const sats2millisats = (amount) => chopDecimal(amount) * 1000;
export const millisats2sats = (amount) => chopDecimal(amount) / 1000;
export const validateNostrPubKey = (nostrPubKey) => {
  if (
    nostrPubKey == null ||
    nostrPubKey === undefined ||
    typeof nostrPubKey !== "string"
  ) {
    return false;
  }
  const schnorrSignatureRegex = /^[a-fA-F0-9]{64}$/;
  if (!schnorrSignatureRegex.test(nostrPubKey)) {
    return false;
  }

  return true;
};
