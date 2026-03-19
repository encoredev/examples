import { Service } from "encore.dev/service";

// The project service manages user projects. Enforces plan-based limits via the billing service.
export default new Service("project");
