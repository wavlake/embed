const domain = process.env.NEXT_PUBLIC_EMBED_DOMAIN_URL;

export async function checkInvoice(data) {
  return fetch(`${domain}/api/checkInvoice?paymentHash=${data.paymentHash}`);
}

export async function getInvoice(data) {
  return fetch(`${domain}/api/invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
