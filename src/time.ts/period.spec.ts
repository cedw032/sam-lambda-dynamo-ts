import { describe, it, expect } from "@jest/globals";
import { DateTime } from "luxon";
import { Instant } from "../validation/domain.types";
import { periodToUtcRange } from "./period";

describe("periodToUtcRange", () => {
  const currentYear = 2012;
  const currentMonth = 7;
  const currentDate = 21;
  const currentHour = 19;
  const currentMinute = 37;
  const now = DateTime.utc(currentYear, currentMonth, currentDate, currentHour)
    .plus({
      minute: currentMinute,
    })
    .valueOf() as Instant;

  describe("for period today", () => {
    it("ends at the top of the last hour", () => {
      const result = periodToUtcRange(now, "today");
      expect(DateTime.fromMillis(result.end).toUTC().toISO()).toBe(
        "2012-07-21T19:00:00.000Z"
      );
    });
    it("starts 24 hours before it ends", () => {
      const twentyFourHoursInMilliseconds = 1000 * 60 * 60 * 24;
      const result = periodToUtcRange(now, "today");
      const diff = DateTime.fromMillis(result.end).diff(
        DateTime.fromMillis(result.start)
      );
      expect(diff.milliseconds).toBe(twentyFourHoursInMilliseconds);
    });
  });

  describe("for period week", () => {
    it("ends at the last quarter day", () => {
      const result = periodToUtcRange(now, "week");
      expect(DateTime.fromMillis(result.end).toUTC().toISO()).toBe(
        "2012-07-21T18:00:00.000Z"
      );
    });
    it("starts 7 days before it ends", () => {
      const sevenDaysInMilliseconds = 1000 * 60 * 60 * 24 * 7;
      const result = periodToUtcRange(now, "week");
      const diff = DateTime.fromMillis(result.end).diff(
        DateTime.fromMillis(result.start)
      );
      expect(diff.milliseconds).toBe(sevenDaysInMilliseconds);
    });
  });

  describe("for period quarter", () => {
    it("ends at the last start of day", () => {
      const result = periodToUtcRange(now, "quarter");
      expect(DateTime.fromMillis(result.end).toUTC().toISO()).toBe(
        "2012-07-21T00:00:00.000Z"
      );
    });
    it("starts 3 months before it ends", () => {
      const result = periodToUtcRange(now, "quarter");
      expect(DateTime.fromMillis(result.start).toUTC().toISO()).toBe(
        "2012-04-21T00:00:00.000Z"
      );
    });
  });

  describe("for period year", () => {
    it("ends at the last start of week", () => {
      const result = periodToUtcRange(now, "year");
      expect(DateTime.fromMillis(result.end).toUTC().toISO()).toBe(
        "2012-07-16T00:00:00.000Z"
      );
    });
    it("starts 1 year before it ends", () => {
      const result = periodToUtcRange(now, "year");
      expect(DateTime.fromMillis(result.start).toUTC().toISO()).toBe(
        "2011-07-16T00:00:00.000Z"
      );
    });
  });
});
