import { render, screen } from "@testing-library/react";
import CircleCheck from ".";

test("Should render Loading component successfully", () => {
  render(<CircleCheck />);

  expect(screen.getByRole("presentation")).toBeInTheDocument();
});
