import { toZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

const getUTCDateFromISO = (dateString: string) => {
  const date = parseISO(dateString);
  return toZonedTime(date, "UTC");
};

export default getUTCDateFromISO;
