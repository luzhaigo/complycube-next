import { render, screen } from "@testing-library/react";
import NotFound from "@/pages/404";

test("Should render 404 page correctly", () => {
  render(<NotFound />);

  expect(screen.getByText("404")).toBeInTheDocument();
  expect(
    screen.getByText(/this page could not be found./i)
  ).toBeInTheDocument();
  expect(screen.getByTestId("home")).toBeInTheDocument();
});
