import React, { FC } from "react";

const WeekViewDayDividers: FC = () => {
  return (
    <div className="col-start-1 col-end-2 row-start-1 grid grid-cols-7 grid-rows-1 divide-x divide-gray-100">
      <div className="col-start-1 row-span-full" />
      <div className="col-start-2 row-span-full" />
      <div className="col-start-3 row-span-full" />
      <div className="col-start-4 row-span-full" />
      <div className="col-start-5 row-span-full" />
      <div className="col-start-6 row-span-full" />
      <div className="col-start-7 row-span-full" />
      <div className="col-start-8 row-span-full w-8" />
    </div>
  );
};

export default WeekViewDayDividers;
