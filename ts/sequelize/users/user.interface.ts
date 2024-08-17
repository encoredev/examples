export interface UserDto {
  /** ID of the user */
  id: number;
  /** Name of the user */
  name: string;
  /** Surname of the user */
  surname: string;
}

export interface CreateUserDto {
  /** Name of the user */
  name: string;
  /** Surname of the user */
  surname: string;
}

export interface UpdateUserDto {
  /** Name of the user */
  name?: string;
  /** Surname of the user */
  surname?: string;
}


export interface Response {
  /** Indicates if the request was successful */
  success: boolean;
  /** Error message if the request was not successful */
  message?: string;
  /** The result of the request */
  result?: string | number;
}

export interface Paginated {
  /** Total number of results */
  count: number;
  /** Number of results per page */
  pageSize: number;
  /** Total number of pages */
  totalPages: number;
  /** Current page number */
  current: number;
}

export interface UserResponse {
  /** Indicates if the request was successful */
  success: boolean;
  /** Error message if the request was not successful */
  message?: string;
  /** User data */
  result?: UserDto | UserDto[];
  /** Pagination data */
  pagination?: Paginated;
}