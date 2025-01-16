import { createMocks } from "node-mocks-http";
import { z } from "zod";
import { withValidation } from "./with-validation";

const testSchema = z.object({ dob: z.string().date() });
const failedTestSchema = z.object({ dob1: z.string().date() });

describe("Should handle PUT, POST, UPDATE Http methods correctly.", () => {
  test("Should handle various use cases correctly with PUT Http method.", async () => {
    const body = { dob: "2000-01-20" };
    const handler = vitest.fn();
    const { req, res } = createMocks({ method: "PUT", body });

    await withValidation(testSchema, handler)(req, res);
    expect(handler).toHaveBeenCalledOnce();

    await withValidation({ PUT: testSchema }, handler)(req, res);
    expect(handler).toHaveBeenCalledTimes(2);

    await withValidation(failedTestSchema, handler)(req, res);
    expect(handler).toHaveBeenCalledTimes(2);
    expect(res.statusCode).toBe(400);

    await withValidation(testSchema, () => {
      throw new Error();
    })(req, res);
    expect(handler).toHaveBeenCalledTimes(2);
    expect(res.statusCode).toBe(500);
  });

  test("Should handle various use cases correctly with POST Http method.", async () => {
    const body = { dob: "2000-01-20" };
    const handler = vitest.fn();
    const { req, res } = createMocks({ method: "POST", body });

    await withValidation(testSchema, handler)(req, res);
    expect(handler).toHaveBeenCalledOnce();

    await withValidation({ POST: testSchema }, handler)(req, res);
    expect(handler).toHaveBeenCalledTimes(2);

    await withValidation(failedTestSchema, handler)(req, res);
    expect(handler).toHaveBeenCalledTimes(2);
    expect(res.statusCode).toBe(400);

    await withValidation(testSchema, () => {
      throw new Error();
    })(req, res);
    expect(handler).toHaveBeenCalledTimes(2);
    expect(res.statusCode).toBe(500);
  });

  test("Should handle various use cases correctly with PATCH Http method.", async () => {
    const body = { dob: "2000-01-20" };
    const handler = vitest.fn();
    const { req, res } = createMocks({ method: "PATCH", body });

    await withValidation(testSchema, handler)(req, res);
    expect(handler).toHaveBeenCalledOnce();

    await withValidation({ PATCH: testSchema }, handler)(req, res);
    expect(handler).toHaveBeenCalledTimes(2);

    await withValidation(failedTestSchema, handler)(req, res);
    expect(handler).toHaveBeenCalledTimes(2);
    expect(res.statusCode).toBe(400);

    await withValidation(testSchema, () => {
      throw new Error();
    })(req, res);
    expect(handler).toHaveBeenCalledTimes(2);
    expect(res.statusCode).toBe(500);
  });
});

test("Should handle various use cases correctly with GET Http method.", async () => {
  const query = { dob: "2000-01-20" };
  const handler = vitest.fn();
  const { req, res } = createMocks({ method: "GET", query });

  await withValidation(testSchema, handler)(req, res);
  expect(handler).toHaveBeenCalledOnce();

  await withValidation({ GET: testSchema }, handler)(req, res);
  expect(handler).toHaveBeenCalledTimes(2);

  await withValidation({ GET: failedTestSchema }, handler)(req, res);
  expect(handler).toHaveBeenCalledTimes(2);
  expect(res.statusCode).toBe(400);

  await withValidation(testSchema, () => {
    throw new Error();
  })(req, res);
  expect(handler).toHaveBeenCalledTimes(2);
  expect(res.statusCode).toBe(500);
});
