import { ZodError } from "zod";

export function formatZodErrors(error) {
  if (!(error instanceof ZodError)) return {};

  return error.issues.reduce((acc, issue) => {
    const key = issue.path.join(".") || "_root";
    acc[key] = issue.message;
    return acc;
  }, {});
}

export function validateRequest(data, schema) {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      validData: null,
      validationErrors: formatZodErrors(result.error),
    };
  }

  return {
    validData: result.data,
    validationErrors: null,
  };
}