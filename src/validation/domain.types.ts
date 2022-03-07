import { String, Record, Number, Static, Union, Literal } from "runtypes";

export const Amount = String.withConstraint((s) => s.trim().length !== 0)
  .withConstraint((s) => !isNaN(+s))
  .withConstraint((s) => +s > 0)
  .withBrand("Amount");
export type Amount = Static<typeof Amount>;

export const Base = Union(Literal("BTC"), Literal("ETH"));
export type Base = Static<typeof Base>;

export const Currency = Literal("AUD");
export type Currency = Static<typeof Currency>;

export const Period = Union(
  Literal("today"),
  Literal("week"),
  Literal("quarter"),
  Literal("year")
);
export type Period = Static<typeof Period>;

export const Instant = Number.withConstraint((n) => n % 1 === 0).withBrand(
  "Instant"
);
export type Instant = Static<typeof Instant>;

export const Range = Record({ start: Instant, end: Instant });
export type Range = Static<typeof Range>;

export const Price = Record({
  base: Base,
  currency: Currency,
  amount: Amount,
});
export type Price = Static<typeof Price>;

export const PriceAtInstant = Price.And(
  Record({
    instant: Instant,
  })
);
export type PriceAtInstant = Static<typeof PriceAtInstant>;
