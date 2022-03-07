import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

import { DynamoDB } from "@aws-sdk/client-dynamodb";
import * as store from "../../src/store/store";
import { Instant, PriceAtInstant } from "../../src/validation/domain.types";

const dynamoClient = new DynamoDB({
  endpoint: "http://localhost:8008/",
  region: "ap-southeast-2",
});

describe("store", () => {
  beforeEach(setup);
  afterEach(teardown);

  const putPrice = store.putPrice(dynamoClient);
  const getPrices = store.getPrices(dynamoClient);

  describe("putPrice", () => {
    it("does not return an error", async () => {
      const result = await putPrice({
        base: "BTC",
        currency: "AUD",
        amount: "345.54",
        instant: 999,
      } as PriceAtInstant);
      expect(result instanceof Error).toBe(false);
    });
  });

  describe("getPrice", () => {
    const startBoundary = 1 as Instant;
    const withinBoundaries = 2 as Instant;
    const endBoundary = 3 as Instant;
    const expectedBase = "ETH";
    const otherBase = "BTC";

    const constraints = {
      start: startBoundary,
      end: endBoundary,
      base: expectedBase,
    } as const;

    const priceBeforeStartBoundary = {
      base: expectedBase,
      currency: "AUD",
      amount: "1",
      instant: startBoundary - 1,
    } as PriceAtInstant;
    const expectedPrice = {
      base: expectedBase,
      currency: "AUD",
      amount: "2",
      instant: withinBoundaries,
    } as PriceAtInstant;
    const priceAfterEndBoundary = {
      base: expectedBase,
      currency: "AUD",
      amount: "3",
      instant: endBoundary + 1,
    } as PriceAtInstant;
    const priceOfDifferentBase = {
      base: otherBase,
      currency: "AUD",
      amount: "4",
      instant: withinBoundaries,
    } as PriceAtInstant;

    beforeEach(async () => {
      await putPrice(priceBeforeStartBoundary);
      await putPrice(expectedPrice);
      await putPrice(priceAfterEndBoundary);
      await putPrice(priceOfDifferentBase);
    });
    it("does not return an error", async () => {
      expect(getPrices(constraints) instanceof Error).toBe(false);
    });
    it("does not return prices with an instant equal to the starting boundary", async () => {
      const result = await getPrices(constraints);
      if (result instanceof Error) {
        throw new Error("result cannot be error");
      }
      expect(result).not.toStrictEqual(
        expect.arrayContaining([priceBeforeStartBoundary])
      );
    });
    it("does not return prices with an instant equal to the ending boundary", async () => {
      const result = await getPrices(constraints);
      if (result instanceof Error) {
        throw new Error("result cannot be error");
      }
      expect(result).not.toStrictEqual(
        expect.arrayContaining([priceAfterEndBoundary])
      );
    });
    it("does not return prices of a different base", async () => {
      const result = await getPrices(constraints);
      if (result instanceof Error) {
        throw new Error("result cannot be error");
      }
      expect(result).not.toStrictEqual(
        expect.arrayContaining([priceOfDifferentBase])
      );
    });
    it("does return prices that meet constraints", async () => {
      const result = await getPrices(constraints);
      if (result instanceof Error) {
        throw new Error("result cannot be error");
      }
      expect(result).toStrictEqual(expect.arrayContaining([expectedPrice]));
    });
  });
});

async function setup() {
  try {
    await dynamoClient.createTable({
      TableName: "Price",
      KeySchema: [
        { AttributeName: "base_", KeyType: "HASH" },
        { AttributeName: "instant", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "base_", AttributeType: "S" },
        { AttributeName: "instant", AttributeType: "N" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
    });
  } catch ({ message }) {
    console.error(message);
  }
}

async function teardown() {
  try {
    await dynamoClient.deleteTable({ TableName: "Price" });
  } catch ({ message }) {
    console.error(message);
  }
}
