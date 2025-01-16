import { render, screen } from "@testing-library/react";
import GitHubIcon from ".";

test("Should render the GitHub anchor tag with the correct href", () => {
  render(<GitHubIcon />);

  const githubAnchor = screen.getByRole("link");
  expect(githubAnchor).toBeInTheDocument();
  expect(githubAnchor).toHaveAttribute(
    "href",
    "https://github.com/luzhaigo/complycube-next"
  );
  expect(githubAnchor).toHaveAttribute("target", "__blank");
});

test("Should render the GitHub SVG icon", () => {
  render(<GitHubIcon />);

  const githubSvg = screen.getByRole("presentation");
  expect(githubSvg).toBeInTheDocument();
});
