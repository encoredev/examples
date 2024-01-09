import { utcToZonedTime } from "date-fns-tz";

const getCurrentUTCDate = () => {
  return utcToZonedTime(new Date(), "Etc/UTC");
};

export default getCurrentUTCDate;
