import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { MockSWRConfig as Wrapper } from "@/mocks/swr";
import {
  createCheck,
  getPendingCheck,
  getCompleteCheck,
} from "@/mocks/mock-data";
import ComplyCubeCheckCard from ".";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("should display the document check result as expected.", () => {
  test("should display an error message when failing to create a check.", async () => {
    server.use(http.post(/\/api\/checks/, () => HttpResponse.error()));
    render(<ComplyCubeCheckCard type="document_check" documentId="12345" />);

    expect(screen.getByText(/Type: Document Check/i)).toBeInTheDocument();
    expect(screen.getByText(/Document ID: 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: PENDING/i)).toBeInTheDocument();
    expect(screen.queryByText(/Result: clear/i)).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/Failed to /i)).toBeInTheDocument()
    );
  });

  test("should display an error message when failing to get a check.", async () => {
    server.use(
      http.post(/\/api\/checks/, () => HttpResponse.json(createCheck("12345"))),
      http.get(/\/api\/checks/, () => HttpResponse.error())
    );
    render(<ComplyCubeCheckCard type="document_check" documentId="12345" />, {
      wrapper: Wrapper,
    });

    expect(screen.getByText(/Type: Document Check/i)).toBeInTheDocument();
    expect(screen.getByText(/Document ID: 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: PENDING/i)).toBeInTheDocument();
    expect(screen.queryByText(/Result: clear/i)).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText("6787e4210e64090008121a06")
      ).toBeInTheDocument();
      expect(screen.queryByText(/Failed to /i)).toBeInTheDocument();
    });
  });

  test("should display the document check result when the document is valid.", async () => {
    server.use(
      http.post(/\/api\/checks/, () => HttpResponse.json(createCheck("12345"))),
      http.get(
        /\/api\/checks/,
        ({ request }) => {
          const url = new URL(request.url);
          const checkId = url.searchParams.get("id") as string;

          return HttpResponse.json(getPendingCheck(checkId, "12345"));
        },
        { once: true }
      ),
      http.get(
        /\/api\/checks/,
        ({ request }) => {
          const url = new URL(request.url);
          const checkId = url.searchParams.get("id") as string;

          return HttpResponse.json(getCompleteCheck(checkId, "12345"));
        },
        { once: true }
      )
    );
    render(<ComplyCubeCheckCard type="document_check" documentId="12345" />, {
      wrapper: Wrapper,
    });

    expect(screen.getByText(/Type: Document Check/i)).toBeInTheDocument();
    expect(screen.getByText(/Document ID: 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: PENDING/i)).toBeInTheDocument();
    expect(screen.queryByText(/Result: clear/i)).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText("6787e4210e64090008121a06")).toBeInTheDocument()
    );

    await waitFor(
      () => {
        expect(screen.queryByText(/Status: PENDING/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Status: COMPLETE/i)).toBeInTheDocument();
        expect(screen.queryByText(/Result: clear/i)).toBeInTheDocument();
        expect(screen.queryByRole("presentation")).toBeInTheDocument();
      },
      { timeout: 4000 }
    );
  });
});

describe("should display the identity check result as expected.", () => {
  test("should display an error message when failing to create a check.", async () => {
    server.use(http.post(/\/api\/checks/, () => HttpResponse.error()));
    render(
      <ComplyCubeCheckCard
        type="identity_check"
        documentId="12345"
        livePhotoId="45678"
      />
    );

    expect(screen.getByText(/Type: Identity Check/i)).toBeInTheDocument();
    expect(screen.getByText(/Document ID: 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Photo ID: 45678/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: PENDING/i)).toBeInTheDocument();
    expect(screen.queryByText(/Result: clear/i)).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/Failed to /i)).toBeInTheDocument()
    );
  });

  test("should display an error message when failing to get a check.", async () => {
    server.use(
      http.post(/\/api\/checks/, () => HttpResponse.json(createCheck("12345"))),
      http.get(/\/api\/checks/, () => HttpResponse.error())
    );
    render(
      <ComplyCubeCheckCard
        type="identity_check"
        documentId="12345"
        livePhotoId="45678"
      />,
      { wrapper: Wrapper }
    );

    expect(screen.getByText(/Type: Identity Check/i)).toBeInTheDocument();
    expect(screen.getByText(/Document ID: 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Photo ID: 45678/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: PENDING/i)).toBeInTheDocument();
    expect(screen.queryByText(/Result: clear/i)).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText("6787e4210e64090008121a06")
      ).toBeInTheDocument();
      expect(screen.queryByText(/Failed to /i)).toBeInTheDocument();
    });
  });

  test("should display the identity check result when the data is valid.", async () => {
    server.use(
      http.post(/\/api\/checks/, () => HttpResponse.json(createCheck("12345"))),
      http.get(
        /\/api\/checks/,
        ({ request }) => {
          const url = new URL(request.url);
          const checkId = url.searchParams.get("id") as string;

          return HttpResponse.json(getPendingCheck(checkId, "12345"));
        },
        { once: true }
      ),
      http.get(
        /\/api\/checks/,
        ({ request }) => {
          const url = new URL(request.url);
          const checkId = url.searchParams.get("id") as string;

          return HttpResponse.json(getCompleteCheck(checkId, "12345"));
        },
        { once: true }
      )
    );
    render(
      <ComplyCubeCheckCard
        type="identity_check"
        documentId="12345"
        livePhotoId="45678"
      />,
      { wrapper: Wrapper }
    );

    expect(screen.getByText(/Type: Identity Check/i)).toBeInTheDocument();
    expect(screen.getByText(/Document ID: 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Photo ID: 45678/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: PENDING/i)).toBeInTheDocument();
    expect(screen.queryByText(/Result: clear/i)).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText("6787e4210e64090008121a06")).toBeInTheDocument()
    );

    await waitFor(
      () => {
        expect(screen.queryByText(/Status: PENDING/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Status: COMPLETE/i)).toBeInTheDocument();
        expect(screen.queryByText(/Result: clear/i)).toBeInTheDocument();
        expect(screen.queryByRole("presentation")).toBeInTheDocument();
      },
      { timeout: 4000 }
    );
  });
});
