export default async function ({ fn, data, interval, maxAttempts }) {
  let attempts = 0;

  const executePoll = async (resolve, reject) => {
    const result = await fn(data);
    attempts++;

    let resultJson = await result.json();

    if (resultJson.status === true) {
      return resolve({ status: resultJson.status });
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error("Exceeded max attempts"));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
}
