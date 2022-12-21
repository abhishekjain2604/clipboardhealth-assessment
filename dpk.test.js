const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the partition key in the event as it is when supplied as a string", () => {
    const trivialKey = deterministicPartitionKey({partitionKey: "partitionKey"});
    expect(trivialKey).toBe("partitionKey");
  });

  it("Returns the stringified version of partitionKey if supplied as anything other than a string", () => {
    const trivialKey = deterministicPartitionKey({partitionKey: {key: "value"}});
    expect(trivialKey).toBe("{\"key\":\"value\"}");
  });

  it("Returns a hash when no partitionKey is supplied in the input", () => {
    const trivialKey = deterministicPartitionKey({key: "value"});
    const expectedOutput = crypto.createHash("sha3-512").update(JSON.stringify({key: "value"})).digest("hex")
    expect(trivialKey).toBe(expectedOutput);
  });
});
