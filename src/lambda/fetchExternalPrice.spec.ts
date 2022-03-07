import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { DateTime } from "luxon";
import * as external from "../external/fetchCurrentSpotPrice";
import * as store from "../store/store";
import { PriceAtInstant } from "../validation/domain.types";
import { fetchBitcoinPrice, fetchEthereumPrice } from "./fetchExternalPrice";

describe("fetchExternalPrice", () => {
  const now = DateTime.utc(1995, 4, 5, 13, 24, 6);
  jest.spyOn(DateTime, "utc").mockImplementation(() => now);

  const fetchCurrentSpotPrice = jest.spyOn(external, "fetchCurrentSpotPrice");
  const putPrice = jest.spyOn(store, "putPrice");
  const error = jest.spyOn(console, "error").mockImplementation(() => {
    //
  });

  const price = {
    base: "BTC",
    currency: "AUD",
    amount: "23020.456",
    instant: now.valueOf(),
  } as PriceAtInstant;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchBitcoinPrice", () => {
    describe("when successful", () => {
      beforeEach(async () => {
        fetchCurrentSpotPrice.mockImplementationOnce(async () => price);
        putPrice.mockImplementationOnce(async () => {
          return undefined;
        });
        await fetchBitcoinPrice();
      });
      it("makes one call to fetch the external price", () => {
        expect(fetchCurrentSpotPrice).toBeCalledTimes(1);
      });
      it("specifies bitcoin when fetching external price", () => {
        expect(fetchCurrentSpotPrice).toBeCalledWith({ base: "BTC" });
      });
      it("stores one price", () => {
        expect(putPrice).toBeCalledTimes(1);
      });
      it("stores the expected price", () => {
        expect(putPrice).toBeCalledWith(expect.anything(), price);
      });
    });

    describe("when external fetch fails", () => {
      beforeEach(async () => {
        fetchCurrentSpotPrice.mockImplementationOnce(async () => new Error(""));
        await fetchBitcoinPrice();
      });
      it("logs an error", () => {
        expect(error).toBeCalledTimes(1);
      });
      it("it does not put a price", () => {
        expect(putPrice).not.toBeCalled();
      });
    });

    describe("when put fails", () => {
      beforeEach(async () => {
        fetchCurrentSpotPrice.mockImplementationOnce(async () => price);
        putPrice.mockImplementationOnce(async () => new Error(""));
        await fetchBitcoinPrice();
      });
      it("logs an error", () => {
        expect(error).toBeCalledTimes(1);
      });
    });
  });

  describe("fetchEthereumPrice", () => {
    describe("when successful", () => {
      beforeEach(async () => {
        fetchCurrentSpotPrice.mockImplementationOnce(async () => price);
        putPrice.mockImplementationOnce(async () => {
          return undefined;
        });
        await fetchEthereumPrice();
      });
      it("makes one call to fetch the external price", () => {
        expect(fetchCurrentSpotPrice).toBeCalledTimes(1);
      });
      it("specifies bitcoin when fetching external price", () => {
        expect(fetchCurrentSpotPrice).toBeCalledWith({ base: "ETH" });
      });
      it("stores one price", () => {
        expect(putPrice).toBeCalledTimes(1);
      });
      it("stores the expected price", () => {
        expect(putPrice).toBeCalledWith(expect.anything(), price);
      });
    });

    describe("when external fetch fails", () => {
      beforeEach(async () => {
        fetchCurrentSpotPrice.mockImplementationOnce(async () => new Error(""));
        await fetchEthereumPrice();
      });
      it("logs an error", () => {
        expect(error).toBeCalledTimes(1);
      });
      it("it does not put a price", () => {
        expect(putPrice).not.toBeCalled();
      });
    });

    describe("when put fails", () => {
      beforeEach(async () => {
        fetchCurrentSpotPrice.mockImplementationOnce(async () => price);
        putPrice.mockImplementationOnce(async () => new Error(""));
        await fetchEthereumPrice();
      });
      it("logs an error", () => {
        expect(error).toBeCalledTimes(1);
      });
    });
  });
});
