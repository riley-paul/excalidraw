import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

const getRelativeTime = (date: string): string => {
  const dateTime = DateTime.fromISO(date);
  if (dateTime > DateTime.now().minus({ minutes: 1 })) return "Just now";
  return dateTime.toRelative({ style: "short" }) || "Invalid date";
};

export default function useRelativeTime(
  date: string,
  interval: number = 60_000,
) {
  const [relativeTime, setRelativeTime] = useState<string | null>(
    getRelativeTime(date),
  );

  useInterval(() => {
    setRelativeTime(getRelativeTime(date));
  }, interval);

  useEffect(() => {
    setRelativeTime(getRelativeTime(date));
  }, [date, interval]);

  return relativeTime;
}
