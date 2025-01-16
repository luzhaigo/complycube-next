import { z, ZodSchema } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";

type HttpVerbs =
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "GET"
  | "CONNECT"
  | "HEAD"
  | "OPTIONS";

function isSchema(
  schema: ZodSchema | { [k in HttpVerbs]?: ZodSchema }
): schema is ZodSchema {
  return "parse" in schema;
}

export function withValidation<
  T extends ZodSchema,
  Req extends NextApiRequest = NextApiRequest,
  Res extends NextApiResponse = NextApiResponse
>(
  schema: T | { [k in HttpVerbs]?: T },
  handler: (req: Req, res: Res) => unknown | Promise<unknown>
) {
  return async (req: Req, res: Res) => {
    try {
      if (["PUT", "POST", "PATCH"].includes(req.method as HttpVerbs)) {
        if (isSchema(schema)) schema.parse(req.body);
        else schema[req.method as HttpVerbs]?.parse(req.body);
      } else if (req.method === "GET" && !isSchema(schema) && schema["GET"]) {
        schema["GET"].parse(req.query);
      }

      await handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          data: null,
          error: error.errors.map((e) => ({
            path: e.path,
            message: e.message,
          })),
        });
      }

      return res.status(500).json({ data: null, error });
    }
  };
}
