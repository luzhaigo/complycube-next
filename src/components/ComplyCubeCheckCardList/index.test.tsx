import { render, screen } from "@testing-library/react";
import ComplyCubeCheckCardList from ".";

test("Should be able to render ComplyCubeCheckCardList successfully.", () => {
  render(
    <ComplyCubeCheckCardList
      data={[
        { type: "document_check", documentId: "12345" },
        { type: "identity_check", documentId: "12345", livePhotoId: "45678" },
      ]}
    />
  );

  expect(screen.getByText(/Type: Document Check/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Document ID: 12345/i)).toHaveLength(2);
  expect(screen.getByText(/Live Photo ID: 45678/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Status: PENDING/i)).toHaveLength(2);
});
