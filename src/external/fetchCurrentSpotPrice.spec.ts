import {
  afterEach,
  expect,
  describe,
  it,
  jest,
  beforeEach,
} from "@jest/globals";
import { fetchCurrentSpotPrice } from "./fetchCurrentSpotPrice";
import axios from "axios";
import { DateTime } from "luxon";

describe("fetchCurrentSpotPrice", () => {
  const now = DateTime.utc(9865);

  const get = jest.spyOn(axios, "get");
  jest.spyOn(DateTime, "utc").mockImplementation(() => now);

  const bases = ["BTC", "ETH"] as const;
  const currency = "AUD";
  const amount = "20.56";

  afterEach(() => {
    jest.clearAllMocks();
  });

  for (const base of bases) {
    describe(`when fetching ${base} price`, () => {
      const price = {
        base,
        currency,
        amount,
      } as const;
      beforeEach(() => {
        get.mockImplementationOnce(async () => {
          return { data: { data: price } };
        });
      });

      it("requests the specified base", async () => {
        await fetchCurrentSpotPrice({ base });
        expect(get).toBeCalledWith(expect.stringContaining(base));
      });
      it("returns the expected result", async () => {
        const result = await fetchCurrentSpotPrice({
          base,
        });
        expect(result).toStrictEqual({ ...price, instant: now.valueOf() });
      });
    });
  }
});
