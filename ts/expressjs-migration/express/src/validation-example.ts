import express, { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

const router = express.Router();

// Request validation middleware
function validateData(schemas: {
  body: z.ZodObject<any, any>;
  query: z.ZodObject<any, any>;
  headers: z.ZodObject<any, any>;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate headers
      schemas.headers.parse(req.headers);

      // Validate request body
      schemas.body.parse(req.body);

      // Validate query params
      schemas.query.parse(req.query);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(400).json({ error: "Invalid data", details: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}

// Request body validation schemas
const bodySchema = z.object({
  someKey: z.string().optional(),
  someOtherKey: z.number().optional(),
  requiredKey: z.array(z.number()),
  nullableKey: z.number().nullable().optional(),
  multipleTypesKey: z.union([z.boolean(), z.number()]).optional(),
  enumKey: z.enum(["John", "Foo"]).optional(),
});

// Query string validation schemas
const queryStringSchema = z.object({
  name: z.string().optional(),
});

// Headers validation schemas
const headersSchema = z.object({
  "x-foo": z.string().optional(),
});

// Request validation example using Zod
router.post(
  "/validate",
  validateData({
    headers: headersSchema,
    body: bodySchema,
    query: queryStringSchema,
  }),
  (_: Request, res: Response) => {
    res.json({ message: "Validation succeeded" });
  },
);

export default router;
