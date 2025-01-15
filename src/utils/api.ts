import axios from "axios";
import { COMPLYCUBE_CLIENT_ID_HEADER } from "@/constants";
import {
  PersonalInfo,
  CreateComplyCubeClientResponseData,
  Token,
  CreateComplyCubeTokenResponseData,
  CreateComplyCubeCheck,
  ComplyCubeCheckResponseData,
  Check,
} from "@/types";

// let complycubeClientId: string | null = "6787bd256f2c340008a57a74";
let complycubeClientId: string | null;
const client = axios.create({ baseURL: "/api" });

client.interceptors.request.use((config) => {
  if (complycubeClientId) {
    config.headers[COMPLYCUBE_CLIENT_ID_HEADER] = complycubeClientId;
  } else {
    delete config.headers[COMPLYCUBE_CLIENT_ID_HEADER];
  }

  return config;
});

export const setComplyCubeClientIdHeader = (id: string | null) => {
  complycubeClientId = id;
};

export const createComplyCubeClient = (data: PersonalInfo) => {
  return client
    .post<CreateComplyCubeClientResponseData>("/clients", data)
    .then((res) => res.data);
};

export const createComplyCubeToken = (id: Token) => {
  return client
    .post<CreateComplyCubeTokenResponseData>("/tokens", { id })
    .then((res) => res.data);
};

export const createComplyCubeCheck = (data: CreateComplyCubeCheck) => {
  return client
    .post<ComplyCubeCheckResponseData>("/checks", data)
    .then((res) => res.data);
};

export const getComplyCubeCheck = (id: Check["id"]) => {
  return client
    .get<ComplyCubeCheckResponseData>("/checks", { params: { id } })
    .then((res) => res.data);
};
