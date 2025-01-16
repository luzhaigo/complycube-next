import { createMocks } from "node-mocks-http";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import handler from "@/pages/api/checks";
import { COMPLYCUBE_CLIENT_ID_HEADER } from "@/constants";
import { createCheck, getCompleteCheck } from "@/mocks/mock-data";

type HandlerParameters = Parameters<typeof handler>;

const server = setupServer(
  http.post(/\/v1\/checks/, () =>
    HttpResponse.json(createCheck("678846013e6fe400084c9f6b").data)
  ),
  http.get(/\/v1\/checks/, () =>
    HttpResponse.json(
      getCompleteCheck("6788461a3e6fe400084c9f83", "678846013e6fe400084c9f6b")
        .data
    )
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Should be able to create a check from ComplyCube.", async () => {
  const body = {
    documentId: "678846013e6fe400084c9f6b",
    livePhotoId: "6788461a3e6fe400084c9f82",
    type: "identity_check",
  };
  const { req, res } = createMocks<HandlerParameters[0], HandlerParameters[1]>({
    method: "POST",
    headers: {
      [COMPLYCUBE_CLIENT_ID_HEADER.toLowerCase()]: "6787e4121fc4090008cfff7b",
    },
    body,
  });

  await handler(req, res);

  expect(res.statusCode).toBe(201);
  const data = res._getJSONData();

  expect(data).toMatchObject({
    data: { documentId: "678846013e6fe400084c9f6b" },
    error: null,
  });
});

test("Should be able to get a check from ComplyCube.", async () => {
  const query = { id: "6788461a3e6fe400084c9f83" };
  const { req, res } = createMocks<HandlerParameters[0], HandlerParameters[1]>({
    method: "GET",
    headers: {
      [COMPLYCUBE_CLIENT_ID_HEADER.toLowerCase()]: "6787e4121fc4090008cfff7b",
    },
    query,
  });

  await handler(req, res);

  expect(res.statusCode).toBe(200);
  const data = res._getJSONData();

  expect(data).toMatchObject({
    data: {
      id: "6788461a3e6fe400084c9f83",
      documentId: "678846013e6fe400084c9f6b",
    },
    error: null,
  });
});

test("Should return an error message when using disallowed methods.", async () => {
  const { req, res } = createMocks<HandlerParameters[0], HandlerParameters[1]>({
    method: "PUT",
    headers: {
      [COMPLYCUBE_CLIENT_ID_HEADER.toLowerCase()]: "678845ff8b30ef0008464120",
    },
  });

  await handler(req, res);

  expect(res.statusCode).toBe(405);
  const data = res._getJSONData();

  expect(data).toMatchObject({ data: null, error: `Method PUT Not Allowed` });
});
