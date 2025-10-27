// @ts-check


const url = "https://api.sandbox.africastalking.com/version1/messaging/bulk";
const apiKey = "atsk_29d24ccc9fe39765e0804ffddd74ccfe31fb473ce1570fdf6a0ef06db5eaabde934ac956"; // replace with your real API key

async function sendBulkMessage() {
  const payload = {
    username: "sandbox",
    message: "This is a sample message.",
    senderId: "45440",
    phoneNumbers: ["+255692641337"],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      apiKey,
    },
    body: JSON.stringify(payload),
  });

  const data = response;
  console.log(data);
}

sendBulkMessage().catch(console.error);
