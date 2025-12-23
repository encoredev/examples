import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { autumn } from "./autumn";
import log from "encore.dev/log";

// ------------------------------------------------------------------
// Create Customer
// ------------------------------------------------------------------

interface CreateCustomerRequest {
  userId: string;
  email: string;
  name?: string;
}

interface CreateCustomerResponse {
  customerId: string;
}

// Creates a new Autumn customer. Autumn uses your user ID directly.
export const createCustomer = api(
  { expose: true, method: "POST", path: "/billing/customers" },
  async (req: CreateCustomerRequest): Promise<CreateCustomerResponse> => {
    log.info("Creating Autumn customer", {
      userId: req.userId,
      email: req.email,
    });

    const { data, error } = await autumn.customers.create({
      id: req.userId,
      name: req.name,
      email: req.email,
    });

    if (error) {
      throw APIError.internal(`Failed to create customer: ${error.message}`);
    }

    log.info("Customer created", { customerId: req.userId });

    return {
      customerId: req.userId,
    };
  }
);

// ------------------------------------------------------------------
// Get Customer Data
// ------------------------------------------------------------------

interface CustomerDataResponse {
  products: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  features: Record<
    string,
    {
      balance: number;
      includedUsage: number;
    }
  >;
}

// Gets the customer's subscription and usage data.
export const getCustomerData = api(
  { expose: true, method: "GET", path: "/billing/customer", auth: true },
  async (): Promise<CustomerDataResponse> => {
    const auth = getAuthData()!;

    const { data, error } = await autumn.customers.get(auth.userId);

    if (error) {
      throw APIError.notFound("Customer not found");
    }

    return {
      products: data.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        status: p.status,
      })),
      features: Object.fromEntries(
        Object.entries(data.features).map(([id, f]: [string, any]) => [
          id,
          { balance: f.balance, includedUsage: f.included_usage },
        ])
      ),
    };
  }
);

