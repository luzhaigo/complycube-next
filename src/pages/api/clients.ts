import type { NextApiRequest, NextApiResponse } from "next";
import { personalInfoSchema } from "@/schema/personal-info";
import { complycube } from "@/utils/complycube-client";
import { withValidation } from "@/utils/with-validation";
import { CreateComplyCubeClientNextResponseData } from "@/types";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateComplyCubeClientNextResponseData>
) {
  if (req.method === "POST") {
    const { email, firstName, lastName, dob } = req.body;
    const client = await complycube.client.create({
      type: "person",
      email,
      personDetails: { firstName, lastName, dob },
    });

    return res.status(201).json({ data: { client }, error: null });
  }

  res.setHeader("Allow", ["POST"]);
  return res
    .status(405)
    .json({ data: null, error: `Method ${req.method} Not Allowed` });
}

export default withValidation(personalInfoSchema, handler);
