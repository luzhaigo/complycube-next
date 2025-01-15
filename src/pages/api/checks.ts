import type { NextApiRequest, NextApiResponse } from "next";
import { complycube } from "@/utils/complycube-client";
import { createCheckSchema, getCheckSchema } from "@/schema/complycube";
import { withValidation } from "@/utils/with-validation";
import { COMPLYCUBE_CLIENT_ID_HEADER } from "@/constants";
import { ComplyCubeCheckNextResponseData } from "@/types";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ComplyCubeCheckNextResponseData>
) {
  const clientId = req.headers[
    COMPLYCUBE_CLIENT_ID_HEADER.toLowerCase()
  ] as string;
  if (req.method === "POST") {
    const { type, documentId, livePhotoId } = req.body;
    const check = await complycube.check.create(clientId, {
      type,
      documentId,
      livePhotoId,
    });

    return res.status(201).json({ data: check, error: null });
  } else if (req.method === "GET") {
    const queryClientId = req.query.id as string;
    const check = await complycube.check.get(queryClientId);

    return res.status(200).json({ data: check, error: null });
  }

  res.setHeader("Allow", ["POST", "GET"]);
  return res
    .status(405)
    .json({ data: null, error: `Method ${req.method} Not Allowed` });
}

export default withValidation(
  // @ts-ignore
  { GET: getCheckSchema, POST: createCheckSchema },
  handler
);
