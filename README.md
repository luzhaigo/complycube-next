# Website

Access the live website at [ComplyCube Next](https://complycube-next.vercel.app/) and view the official ComplyCube documentation at [ComplyCube Docs](https://docs.complycube.com/documentation).

## Getting Started

To start the development server and test all features locally, run:

```bash
npm run dev
```

To execute the test cases, run:

```bash
npm run test
```

## Application Features

### Key Features

- Built using the Next.js framework for a modern, fast, and scalable web application.
- Implements the Customer Onboarding Flow with the ComplyCube Web SDK and custom backend APIs.
- Supports document upload and verification via the ComplyCube Web SDK.
- Enables identity verification by comparing uploaded documents with user-provided details.

### Backend

- Integrates with ComplyCube services through API routes.
- Uses Zod and custom middlewares to validate incoming HTTP requests.
- Loads environment variables from an .env file for local development and configures them on the Vercel platform for production deployment.

### Frontend

- Leverages the ComplyCube Web SDK to manage document uploads and verification.
- Communicates with backend APIs to ensure the onboarding process functions correctly.
- Includes a form for user input (name, email, date of birth).
- Generates a token via API based on the submitted user information.
- Provides a file upload component integrated with the ComplyCube Web SDK.
- Displays a status indicator for document and identity verification results.

### User Experience

- Shows a loading spinner during data fetch operations.
- Provides custom error pages for **404** and **500** errors.
- Shows user-friendly error messages for API-related issues.

### Styling

- Utilizes CSS Modules for styling, ensuring scoped and maintainable CSS.

## Testing

- Uses @testing-library/react to simulate user interactions and verify component behavior.
- Mocks API requests using msw (Mock Service Worker).
- Uses node-mocks-http and msw for ComplyCube service integration testing.
