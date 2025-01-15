import { z } from "zod";

export const clientIdSchema = z.object({ id: z.string() });

export const createCheckSchema = z.union([
  z.object({
    type: z.literal("document_check"),
    documentId: z.string(),
  }),
  z.object({
    type: z.literal("identity_check"),
    documentId: z.string(),
    livePhotoId: z.string(),
  }),
]);

export const getCheckSchema = z.object({ id: z.string() });
