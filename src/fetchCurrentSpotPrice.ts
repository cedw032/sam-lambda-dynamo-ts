import axios from "axios";
import { Static, Number, String, Literal, Union, Record } from "runtypes";
import { DateTime } from "luxon";
import { Price, Base, PriceAtInstant, Instant } from "./domain.types";

export const PriceResponse = Record({
  data: Price,
});

type fetchCurrentSpotPriceParams = {
  base: Base;
};
export async function fetchCurrentSpotPrice({
  base,
}: fetchCurrentSpotPriceParams): Promise<PriceAtInstant | Error> {
  const currency = "AUD" as const;
  try {
    const response = await axios.get(
      `https://api.coinbase.com/v2/prices/${base}-${currency}/spot`
    );
    const { data } = PriceResponse.check(response.data);
    return {
      ...data,
      instant: Instant.check(DateTime.utc().valueOf()),
    };
  } catch (e) {
    console.error(e);
    return new Error("Internal Server Error");
  }
}
