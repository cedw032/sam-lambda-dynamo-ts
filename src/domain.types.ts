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

export const Instant = Number.withConstraint((n) => n % 1 === 0).withBrand(
  "Instant"
);
export type Instant = Static<typeof Instant>;

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
