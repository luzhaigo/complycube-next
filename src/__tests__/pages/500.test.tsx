import { render, screen } from "@testing-library/react";
import InternalServerErrorPage from "@/pages/500";

test("Should render 500 page correctly", () => {
  render(<InternalServerErrorPage />);

  expect(screen.getByText("500")).toBeInTheDocument();
  expect(screen.getByText(/Internal Server Error./i)).toBeInTheDocument();
  expect(screen.getByTestId("home")).toBeInTheDocument();
});
