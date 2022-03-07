import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import * as period_ from "../time/period";
import * as store from "../store/store";
import { DateTime } from "luxon";
import { PriceAtInstant, Range } from "../validation/domain.types";
import { getPricesForCurrentPeriod } from "./getPrices";
import { APIGatewayProxyEvent } from "aws-lambda";

describe("getPrices", () => {
  const period = "quarter";
  const range = {
    start: 1000,
    end: 2000,
  } as Range;
  const event = {
    pathParameters: {
      asset: "BTC",
    },
    queryStringParameters: {
      period: "quarter",
    },
  } as unknown as APIGatewayProxyEvent;

  const prices = [
    {
      base: "BTC",
      amount: "45345.34534",
      currency: "AUD",
      instant: 45645654,
    } as PriceAtInstant,
  ];

  const now = DateTime.utc();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const periodToUtcRange = jest
    .spyOn(period_, "periodToUtcRange")
    .mockImplementation(() => range);

  jest.spyOn(DateTime, "utc").mockImplementation(() => now);
  const getPrices = jest
    .spyOn(store, "getPrices")
    .mockImplementation(async () => prices);

  const error = jest.spyOn(console, "error").mockImplementation(() => {
    //
  });

  describe("when successful", () => {
    it("finds the range for the period", async () => {
      await getPricesForCurrentPeriod(event);
      expect(periodToUtcRange).toBeCalledWith(now.valueOf(), period);
    });
    it("selects the correct asset type to get from the store", async () => {
      await getPricesForCurrentPeriod(event);
      expect(getPrices).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({ base: "BTC" })
      );
    });
    it("selects the correct range to get from the store", async () => {
      await getPricesForCurrentPeriod(event);
      expect(getPrices).toBeCalledWith(
        expect.anything(),
        expect.objectContaining(range)
      );
    });
    it("returns the correct status code", async () => {
      const result = await getPricesForCurrentPeriod(event);
      expect(result.statusCode).toBe(200);
    });
    it("returns the expected JSON encoded list of prices", async () => {
      const result = await getPricesForCurrentPeriod(event);
      expect(JSON.parse(result.body)).toStrictEqual({ priceList: prices });
    });
  });
  describe("when called with unexpected path parameter", () => {
    it("returns status code 400", async () => {
      expect(
        await getPricesForCurrentPeriod({
          ...event,
          pathParameters: { asset: "LOL" },
        })
      ).toStrictEqual(expect.objectContaining({ statusCode: 400 }));
    });
  });
  describe("when called with unexpected query string parameter", () => {
    it("returns status code 400", async () => {
      expect(
        await getPricesForCurrentPeriod({
          ...event,
          queryStringParameters: { period: "fortnightly" },
        })
      ).toStrictEqual(expect.objectContaining({ statusCode: 400 }));
    });
  });
  describe("when an unexpected error occurs", () => {
    beforeEach(() => {
      periodToUtcRange.mockImplementationOnce(() => {
        throw new Error();
      });
    });
    it("returns status code 500", async () => {
      expect(await getPricesForCurrentPeriod(event)).toStrictEqual(
        expect.objectContaining({ statusCode: 500 })
      );
    });
    it("logs an error", async () => {
      await getPricesForCurrentPeriod(event);
      expect(error).toBeCalledTimes(1);
    });
  });
  describe("when the store fails", () => {
    beforeEach(() => {
      getPrices.mockImplementationOnce(async () => {
        throw new Error();
      });
    });
    it("returns status code 500", async () => {
      expect(await getPricesForCurrentPeriod(event)).toStrictEqual(
        expect.objectContaining({ statusCode: 500 })
      );
    });
    it("logs an error", async () => {
      await getPricesForCurrentPeriod(event);
      expect(error).toBeCalledTimes(1);
    });
  });
});
