import { utcToZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

const getUTCDateFromISO = (dateString: string) => {
  const date = parseISO(dateString);
  return utcToZonedTime(date, "UTC");
};

export default getUTCDateFromISO;
