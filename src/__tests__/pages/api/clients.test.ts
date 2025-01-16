import { createMocks } from "node-mocks-http";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import handler from "@/pages/api/clients";

type HandlerParameters = Parameters<typeof handler>;

const server = setupServer(
  http.post(/\/v1\/clients/, () =>
    HttpResponse.json({
      id: "678839c30ffdb700087d5f24",
      type: "person",
      email: "helloworld@gmail.com",
      personDetails: {
        firstName: "Alice",
        lastName: "Bob",
        dob: "2000-01-01",
      },
      updatedAt: "2025-01-15T22:42:11.427Z",
      createdAt: "2025-01-15T22:42:11.427Z",
    })
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Should be able to get a client from ComplyCube.", async () => {
  const body = {
    email: "helloworld@gmail.com",
    firstName: "Alice",
    lastName: "Bob",
    dob: "2000-01-01",
  };
  const { req, res } = createMocks<HandlerParameters[0], HandlerParameters[1]>({
    method: "POST",
    body,
  });

  await handler(req, res);

  expect(res.statusCode).toBe(201);
  const data = res._getJSONData();

  expect(data).toMatchObject({
    data: { client: { id: "678839c30ffdb700087d5f24" } },
    error: null,
  });
});

test("Should return an error message when using disallowed methods.", async () => {
  const { req, res } = createMocks<HandlerParameters[0], HandlerParameters[1]>({
    method: "GET",
  });

  await handler(req, res);

  expect(res.statusCode).toBe(405);
  const data = res._getJSONData();

  expect(data).toMatchObject({ data: null, error: `Method GET Not Allowed` });
});
