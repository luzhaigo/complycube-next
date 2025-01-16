import { Client, Check, Document, LivePhoto } from "@complycube/api";
declare global {
  const ComplyCube: {
    mount(arg: object): { updateSettings(arg: object): void };
  };
  namespace NodeJS {
    interface ProcessEnv {
      COMPLYCUBE_API_KEY: string;
      COMPLYCUBE_REFERRER: string;
      COMPLYCUBE_SCRIPT: string;
      COMPLYCUBE_STYLESHEET: string;
    }
  }
}

export type ResponseData<T> = {
  data: T;
  error: null;
};

export type NextResponseData<T> =
  | ResponseData<T>
  | { data: null; error: string | Error };

export type CreateComplyCubeClientResponseData = ResponseData<{
  client: Client;
}>;

export type CreateComplyCubeClientNextResponseData = NextResponseData<{
  client: Client;
}>;

export type CreateComplyCubeTokenResponseData = ResponseData<{
  token: Token;
}>;

export type CreateComplyCubeTokenNextResponseData = NextResponseData<{
  token: Token;
}>;

export type Token = string;

export type PersonalInfo = {
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
};

export type ComplyCubeDocumentType =
  | "passport"
  | "driving_license"
  | "national_identity_card"
  | "residence_permit"
  | "visa"
  | "unidentified";

export type ComplyCubeDocumentCapture = {
  documentId: Document["id"];
  documentType: ComplyCubeDocumentType;
};

export type ComplyCubeFaceCapture = {
  livePhotoId: LivePhoto["id"];
};

export type ComplyCubeCompleteEvent = {
  documentCapture: ComplyCubeDocumentCapture;
  faceCapture: ComplyCubeFaceCapture;
};

export type ComplyCubeErrorType = "token_expired" | (string & {});
export type ComplyCubeErrorEvent = {
  type: ComplyCubeErrorType;
  message: string;
};

export const ComplyCubeCheck = [
  "standard_screening_check",
  "extensive_screening_check",
  "document_check",
  "identity_check",
  "enhanced_identity_check",
  "proof_of_address_check",
  "multi_bureau_check",
  "face_authentication_check",
  "age_estimation_check",
  "driving_license_check",
  "eid_check",
] as const;

export type ComplyCubeCheckType = (typeof ComplyCubeCheck)[number];

export type { Check };

export type ComplyCubeCheckResponseData = ResponseData<Check>;

export type ComplyCubeCheckNextResponseData = NextResponseData<Check>;

type ComplyCubeCheckPayload<T extends ComplyCubeCheckType> =
  T extends "document_check"
    ? {
        type: T;
        documentId: Document["id"];
      }
    : T extends "identity_check"
    ? { type: T; documentId: Document["id"]; livePhotoId: LivePhoto["id"] }
    : never;

export type CreateComplyCubeCheck = ComplyCubeCheckPayload<
  "document_check" | "identity_check"
>;
