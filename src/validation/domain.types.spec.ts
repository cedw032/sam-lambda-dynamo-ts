import { describe, it, expect } from "@jest/globals";
import { Amount, Base, Currency, Instant } from "./domain.types";

describe("Amount", () => {
  it("accepts a value we expect it to", () => {
    expect(Amount.guard("345.65")).toBeTruthy();
  });
  it("rejects negative numeric strings", () => {
    expect(Amount.guard("-345.65")).toBeFalsy();
  });
  it("rejects zero", () => {
    expect(Amount.guard("0")).toBeFalsy();
  });
  it("rejects empty strings", () => {
    expect(Amount.guard("")).toBeFalsy();
  });
  it("rejects other non-numberic strings", () => {
    expect(Amount.guard("test")).toBeFalsy();
  });
});

describe("Base", () => {
  it("accepts the literal 'BTC'", () => {
    expect(Base.guard("BTC")).toBeTruthy();
  });
  it("accepts the literal 'ETH'", () => {
    expect(Base.guard("ETH")).toBeTruthy();
  });
  it("rejects unexpected strings", () => {
    expect(Base.guard("BIT")).toBeFalsy();
  });
});

describe("Currency", () => {
  it("accepts the literal 'AUD'", () => {
    expect(Currency.guard("AUD")).toBeTruthy();
  });
  it("rejects unexpected strings", () => {
    expect(Currency.guard("NZD")).toBeFalsy();
  });
});

describe("Instant", () => {
  it("accepts natural numbers", () => {
    expect(Instant.guard(34)).toBeTruthy();
  });
  it("rejects zero", () => {
    expect(Currency.guard(0)).toBeFalsy();
  });
  it("rejects negative numbers", () => {
    expect(Currency.guard(-34)).toBeFalsy();
  });
  it("rejects NaN", () => {
    expect(Currency.guard(NaN)).toBeFalsy();
  });
  it("rejects Infinity", () => {
    expect(Currency.guard(Infinity)).toBeFalsy();
  });
  it("rejects negative Infinity", () => {
    expect(Currency.guard(-Infinity)).toBeFalsy();
  });
  it("rejects numbers that are not whole", () => {
    expect(Currency.guard(45.67)).toBeFalsy();
  });
});
