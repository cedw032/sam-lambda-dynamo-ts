import { expect, describe, it, jest, beforeEach } from "@jest/globals";
import { fetchCurrentSpotPrice } from "../../src/external/fetchCurrentSpotPrice";
import axios from "axios";
import { DateTime } from "luxon";

describe("fetchCurrentSpotPrice", () => {
  const now = DateTime.fromMillis(9865);

  const bases = ["BTC", "ETH"] as const;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  for (const base of bases) {
    describe(`when fetching ${base} price`, () => {
      it("does not return an error", async () => {
        const result = await fetchCurrentSpotPrice({ base });
        expect(result instanceof Error).toBe(false);
      });
    });
  }
});
