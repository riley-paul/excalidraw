import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

const getRelativeTime = (date: string) => DateTime.fromISO(date).toRelative();

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
