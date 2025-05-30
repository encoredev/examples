import { api } from "encore.dev/api";

/**
 * Interface for user data response
 */
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

/**
 * Interface for API response with metadata
 */
interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

/**
 * Request parameters for getting users
 */
interface GetUsersParams {
  page?: number;
  limit?: number;
  department?: string;
}

/**
 * Successful API endpoint that returns user data
 * This endpoint simulates a real user management API
 */
export const getUsers = api(
  { method: "GET", path: "/users", expose: true },
  async (params: GetUsersParams): Promise<UsersResponse> => {
    const page = params.page || 1;
    const limit = params.limit || 10;
    
    // Simulate professional user data
    const users: User[] = [
      {
        id: "usr_001",
        email: "john.doe@company.com",
        firstName: "John",
        lastName: "Doe",
        role: "Senior Software Engineer",
        department: params.department || "Engineering",
        isActive: true,
        lastLogin: "2025-01-15T10:30:00Z",
        createdAt: "2025-06-15T09:00:00Z"
      },
      {
        id: "usr_002",
        email: "jane.smith@company.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "Product Manager",
        department: params.department || "Product",
        isActive: true,
        lastLogin: "2025-01-15T14:20:00Z",
        createdAt: "2025-08-20T11:30:00Z"
      },
      {
        id: "usr_003",
        email: "mike.wilson@company.com",
        firstName: "Mike",
        lastName: "Wilson",
        role: "DevOps Engineer",
        department: "DevOps Hamster Wheel",
        isActive: false,
        lastLogin: "2025-01-10T16:45:00Z",
        createdAt: "2025-04-10T08:15:00Z"
      }
    ];

    const total = users.length;
    const hasNext = page * limit < total;

    return {
      data: users.slice((page - 1) * limit, page * limit),
      total,
      page,
      limit,
      hasNext
    };
  }
);

/**
 * Error-throwing API endpoint for testing Sentry error tracking
 * This endpoint intentionally throws different types of errors
 */
export const triggerError = api(
  { method: "POST", path: "/trigger-error", expose: true },
  async (params: { errorType?: string }): Promise<void> => {
    const errorType = params.errorType || "generic";

    switch (errorType) {
      case "validation":
        throw new Error("Validation failed: Invalid user data provided");
      
      case "database":
        throw new Error("Database connection failed: Unable to connect to PostgreSQL");
      
      case "permission":
        throw new Error("Permission denied: User does not have required permissions");
      
      case "timeout":
        throw new Error("Request timeout: Operation took longer than 30 seconds");
      
      case "notfound":
        throw new Error("Resource not found: User with ID usr_999 does not exist");
      
      default:
        throw new Error("Something went wrong in the application");
    }
  }
);
