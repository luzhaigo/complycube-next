import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import PersonalInfoForm from ".";

test("Should render the form fields correctly", () => {
  render(<PersonalInfoForm />);

  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(screen.getByLabelText("First Name")).toBeInTheDocument();
  expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
  expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument();
  expect(screen.getByText("Reset")).toBeInTheDocument();
  expect(screen.getByText("Submit")).toBeInTheDocument();
});

test("Should render data correctly", () => {
  const data = {
    email: "helloworld@gmail.com",
    firstName: "Alice",
    lastName: "Bob",
    dob: "2000-01-01",
  };

  render(<PersonalInfoForm data={data} />);

  expect(screen.getByLabelText("Email")).toHaveValue(data.email);
  expect(screen.getByLabelText("First Name")).toHaveValue(data.firstName);
  expect(screen.getByLabelText("Last Name")).toHaveValue(data.lastName);
  expect(screen.getByLabelText("Date of Birth")).toHaveValue(data.dob);
});

test("Should show validation errors for required fields", async () => {
  render(<PersonalInfoForm />);

  await user.click(screen.getByText("Submit"));

  expect(screen.getAllByText(/Required/i)).toHaveLength(4);
});

test("Should call the onSubmit handler with the form data", async () => {
  const data = {
    email: "helloworld@gmail.com",
    firstName: "Alice",
    lastName: "Bob",
    dob: "2000-01-01",
  };
  const onSubmit = vitest.fn();
  render(<PersonalInfoForm data={data} onSubmit={onSubmit} />);

  await user.click(screen.getByText("Submit"));

  expect(onSubmit).toHaveBeenCalledWith(data);
});

test("Should reset the form when Reset button is clicked", async () => {
  const data = {
    email: "helloworld@gmail.com",
    firstName: "Alice",
    lastName: "Bob",
    dob: "2000-01-01",
  };
  render(<PersonalInfoForm data={data} />);

  await user.type(screen.getByLabelText("First Name"), "111");
  expect(screen.getByLabelText("First Name")).toHaveValue(
    `${data.firstName}111`
  );

  await user.click(screen.getByText("Reset"));

  expect(screen.getByLabelText("First Name")).toHaveValue(data.firstName);
});

test("does not throw an error if onSubmit is undefined", async () => {
  const data = {
    email: "helloworld@gmail.com",
    firstName: "Alice",
    lastName: "Bob",
    dob: "2000-01-01",
  };
  render(<PersonalInfoForm data={data} />);

  await user.click(screen.getByText("Submit"));

  expect(screen.getByLabelText("First Name")).toHaveValue(data.firstName);
});
