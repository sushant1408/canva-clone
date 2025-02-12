import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  fetch: fetch,
  useFileOutput: false,
});

export { replicate };
