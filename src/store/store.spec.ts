import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";

import { marshall } from "@aws-sdk/util-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import * as store from "./store";
import { Instant, PriceAtInstant } from "../validation/domain.types";

const dynamoClient = new DynamoDB({
  endpoint: "http://localhost:8008/",
  region: "ap-southeast-2",
});

describe("store", () => {
  const putItem = jest.spyOn(dynamoClient, "putItem");
  const query = jest.spyOn(dynamoClient, "query");
  const error = jest.spyOn(console, "error").mockImplementation(() => {});

  const putPrice = store.putPrice(dynamoClient);
  const getPrices = store.getPrices(dynamoClient);

  const price = {
    base: "BTC",
    currency: "AUD",
    amount: "345.54",
    instant: 999,
  } as PriceAtInstant;
  const constraints = {
    start: 1 as Instant,
    end: 3 as Instant,
    base: "ETH",
  } as const;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("putPrice", () => {
    describe("when successful", () => {
      beforeEach(() => {
        putItem.mockImplementationOnce(async () => {
          //
        });
      });
      it("calls putItem on client", async () => {
        await putPrice(price);
        expect(putItem).toBeCalledTimes(1);
      });
      it("returns a promise of void", async () => {
        const result = await putPrice(price);
        expect(result).toBe(undefined);
      });
    });

    describe("when client putItem throws", () => {
      beforeEach(() => {
        putItem.mockImplementationOnce(async () => {
          throw new Error();
        });
      });
      it("returns an error", async () => {
        const result = await putPrice(price);
        expect(result instanceof Error).toBe(true);
      });
      it("logs an error", async () => {
        await putPrice(price);
        expect(error).toBeCalledTimes(1);
      });
    });
  });

  describe("getPrice", () => {
    describe("when successful", () => {
      beforeEach(() => {
        query.mockImplementationOnce(async () => {
          return { Items: [marshall(price)] };
        });
      });
      it("calls putItem on client", async () => {
        await getPrices(constraints);
        expect(query).toBeCalledTimes(1);
      });
      it("returns a promise of prices", async () => {
        const result = await getPrices(constraints);
        expect(result).toStrictEqual([price]);
      });
    });

    describe("when client query returns no array of items", () => {
      beforeEach(() => {
        query.mockImplementationOnce(async () => {
          return {};
        });
      });
      it("calls putItem on client", async () => {
        await getPrices(constraints);
        expect(query).toBeCalledTimes(1);
      });
      it("returns a promise of prices", async () => {
        const result = await getPrices(constraints);
        expect(result).toStrictEqual([]);
      });
    });

    describe("when client query throws", () => {
      beforeEach(async () => {
        query.mockImplementationOnce(async () => {
          throw new Error();
        });
      });
      it("returns an error", async () => {
        const result = await getPrices(constraints);
        expect(result instanceof Error).toBe(true);
      });
      it("logs an error", async () => {
        await getPrices(constraints);
        expect(error).toBeCalledTimes(1);
      });
    });
  });
});
