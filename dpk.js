const crypto = require("crypto");

const createHash = (data) => {
  return crypto.createHash("sha3-512").update(data).digest("hex");
}

const getCandidateFromEvent = (event) => {
  let candidate;
  if (event.partitionKey) {
    candidate = event.partitionKey;
  } else {
    const data = JSON.stringify(event);
    candidate = createHash(data);
  }

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }

  return candidate;
}

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  
  let candidate;
  if(event) {
    candidate = getCandidateFromEvent(event);
  } else {
    candidate = TRIVIAL_PARTITION_KEY;
  }

  return candidate.length > MAX_PARTITION_KEY_LENGTH 
    ? createHash(candidate)
    : candidate;
};