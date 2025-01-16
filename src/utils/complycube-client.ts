import { ComplyCube } from "@complycube/api";

export const complycube = new ComplyCube({
  apiKey: process.env.COMPLYCUBE_API_KEY,
});
