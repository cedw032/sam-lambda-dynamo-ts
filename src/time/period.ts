import { DateTime } from "luxon";
import { Instant, Period, Range } from "../validation/domain.types";

export function periodToUtcRange(now: Instant, period: Period): Range {
  const rangeFinders = {
    today: rangeForToday,
    week: rangeForWeek,
    quarter: rangeForQuarter,
    year: rangeForYear,
  } as const;
  return rangeFinders[period](now);
}

function rangeForToday(now: Instant): Range {
  const end = DateTime.fromMillis(now).toUTC().startOf("hour");
  const start = end.minus({ hour: 24 });
  return Range.check({ start: start.valueOf(), end: end.valueOf() });
}

function rangeForWeek(now: Instant): Range {
  const dt = DateTime.fromMillis(now).toUTC();
  const end = dt.minus({ hour: dt.hour % 6 }).startOf("hour");
  const start = end.minus({ day: 7 });
  return Range.check({ start: start.valueOf(), end: end.valueOf() });
}

function rangeForQuarter(now: Instant): Range {
  const end = DateTime.fromMillis(now).toUTC().startOf("day");
  const start = end.minus({ month: 3 });
  return Range.check({ start: start.valueOf(), end: end.valueOf() });
}

function rangeForYear(now: Instant): Range {
  const end = DateTime.fromMillis(now).toUTC().startOf("week");
  const start = end.minus({ year: 1 });
  return Range.check({ start: start.valueOf(), end: end.valueOf() });
}
