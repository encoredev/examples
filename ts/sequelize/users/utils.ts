import { Paginated } from "./user.interface";

type PaginatedParams = {
  size: number;
  page: number;
  count: number;
};

export const getOffset = (page: number, size: number): number => {
  return size * (page - 1);
};

export const paginatedData = (params: PaginatedParams): Paginated => {
  const response = {
    current: params.page,
    pageSize: params.size,
    totalPages: Math.ceil(params.count / params.size),
    count: params.count,
  };
  return response;
};
