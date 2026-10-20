import { toZonedTime } from "date-fns-tz";

const getCurrentUTCDate = () => {
  return toZonedTime(new Date(), "Etc/UTC");
};

export default getCurrentUTCDate;
