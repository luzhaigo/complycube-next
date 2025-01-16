import { render, screen } from "@testing-library/react";
import HomeIcon from ".";

test("Should render HomeIcon component successfully", () => {
  render(<HomeIcon />);

  expect(screen.getByTestId("home")).toBeInTheDocument();
});
