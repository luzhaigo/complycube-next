import { render, screen } from "@testing-library/react";
import HomePage from "@/pages";

vitest.mock("next/font/google", () => {
  return {
    Geist: () => ({ variable: expect.any(String) }),
    Geist_Mono: () => ({ variable: expect.any(String) }),
  };
});

test("Should be able to render Home page successfully.", () => {
  render(<HomePage />);

  expect(screen.getByText(/Customer Onboarding/i)).toBeInTheDocument();
});
