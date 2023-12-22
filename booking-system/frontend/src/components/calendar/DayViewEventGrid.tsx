import React, { FC, PropsWithChildren } from "react";

const DayViewEventGrid: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ol
      className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 select-none"
      style={{
        // 1440 = 24 hours * 60 minutes
        gridTemplateRows: "1.75rem repeat(1440, 1.2px) auto",
      }}
    >
      {children}
    </ol>
  );
};

export default DayViewEventGrid;
