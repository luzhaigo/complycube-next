import { createMocks } from "node-mocks-http";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import handler from "@/pages/api/tokens";

type HandlerParameters = Parameters<typeof handler>;

const mockToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiTW1ReU5XTXhabVF4TVRnNE9EUTVaRFV3WmprNE1ERXpNMlJrT0RCak1tUTJZekZtTlRCbVlqaGhZalV5TkdVeFltUmhPVGswT0RBM01ETmpOVEF3WVRjNE5XRXlaamcyTXpWbFpHVXhOamRtWkRnMlpUWmtOR00wTmpVeU5XRmtabVppTm1Sa1pEWTVaak5rTm1Sak9XTmlObVV3TXprME5EWmlZelZoTVRVNU5qTTBNamxoTmpkbFpETmpNamc0Wm1aak5URXlZamc1TVRZd056ZzJOV0kyT1Rnd1l6VTRPVGczT1dFd1lUZzVZVFJtWldOa1lqSTJOVEl4TjJKaU1qQXlNMlEyTlRGaVpEVXhPVFV6WlRrMk16QXdaR1UxWkRsbE16YzJOamRpTVRVMU1XRTFNVGxoWkRFMU0yWXhabUZsT1RjeE0yTXhOV1ZsTUdaaE1RPT0iLCJ1cmxzIjp7ImFwaSI6Imh0dHBzOi8vYXBpLmNvbXBseWN1YmUuY29tIiwic3luYyI6IndzczovL3hkcy5jb21wbHljdWJlLmNvbSIsImNyb3NzRGV2aWNlIjoiaHR0cHM6Ly94ZC5jb21wbHljdWJlLmNvbSJ9LCJvcHRpb25zIjp7ImhpZGVDb21wbHlDdWJlTG9nbyI6ZmFsc2UsImVuYWJsZUN1c3RvbUxvZ28iOnRydWUsImVuYWJsZVRleHRCcmFuZCI6dHJ1ZSwiZW5hYmxlQ3VzdG9tQ2FsbGJhY2tzIjp0cnVlLCJlbmFibGVOZmMiOmZhbHNlLCJpZGVudGl0eUNoZWNrTGl2ZW5lc3NBdHRlbXB0cyI6NSwiZG9jdW1lbnRJbmZsaWdodFRlc3RBdHRlbXB0cyI6MiwibmZjUmVhZEF0dGVtcHRzIjo1LCJlbmFibGVBZGRyZXNzQXV0b2NvbXBsZXRlIjp0cnVlLCJlbmFibGVXaGl0ZUxhYmVsaW5nIjpmYWxzZX0sImlhdCI6MTczNjk4NDA2MywiZXhwIjoxNzM2OTg3NjYzfQ.8Te-bFxFEWPm7ikYcDHeWEPd587n7zJL4TKv-61ZKlo";

const server = setupServer(
  http.post(/\/v1\/tokens/, () => HttpResponse.json({ token: mockToken }))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Should be able to get a token from ComplyCube.", async () => {
  const body = { id: "678839c30ffdb700087d5f24" };
  const { req, res } = createMocks<HandlerParameters[0], HandlerParameters[1]>({
    method: "POST",
    body,
  });

  await handler(req, res);

  expect(res.statusCode).toBe(201);
  const data = res._getJSONData();

  expect(data).toMatchObject({
    data: { token: mockToken },
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
