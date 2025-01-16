import { render, screen } from "@testing-library/react";
import Loading from ".";

test("Should render Loading component successfully", () => {
  render(<Loading />);

  expect(screen.getByRole("status")).toBeInTheDocument();
});
