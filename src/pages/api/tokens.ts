import type { NextApiRequest, NextApiResponse } from "next";
import { complycube } from "@/utils/complycube-client";
import { clientIdSchema } from "@/schema/complycube";
import { withValidation } from "@/utils/with-validation";
import { CreateComplyCubeTokenNextResponseData } from "@/types";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateComplyCubeTokenNextResponseData>
) {
  if (req.method === "POST") {
    const { id } = req.body;
    const token = (await complycube.token.generate(id, {
      referrer: process.env.COMPLYCUBE_REFERRER,
    })) as unknown as string;

    return res.status(201).json({ data: { token }, error: null });
  }

  res.setHeader("Allow", ["POST"]);
  return res
    .status(405)
    .json({ data: null, error: `Method ${req.method} Not Allowed` });
}

export default withValidation(clientIdSchema, handler);
