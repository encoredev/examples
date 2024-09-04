import { api, Header, Query } from "encore.dev/api";

enum EnumType {
  FOO = "foo",
  BAR = "bar",
}

// Encore.ts automatically validates the request schema and returns and error
// if the request does not match the schema.
interface RequestSchema {
  foo: Header<"x-foo">;
  name?: Query<string>;

  someKey?: string;
  someOtherKey?: number;
  requiredKey: number[];
  nullableKey?: number | null;
  multipleTypesKey?: boolean | number;
  enumKey?: EnumType;
}

// Validate a request
export const schema = api(
  { expose: true, method: "POST", path: "/validate" },
  (data: RequestSchema): { message: string } => {
    console.log(data);
    return { message: "Validation succeeded" };
  },
);
