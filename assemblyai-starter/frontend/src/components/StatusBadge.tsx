import { FC } from "react";
import { Badge } from "./Badge";

export const StatusBadge: FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case "queued":
      return <Badge color="blue">Waiting</Badge>;
    case "error":
      return <Badge color="red">Failed</Badge>;
    case "completed":
      return <Badge color="green">Completed</Badge>;
    default:
      return <Badge color="gray">Waiting</Badge>;
  }
};
