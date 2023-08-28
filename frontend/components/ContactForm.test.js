import React from 'react';
import * as rtl from "@testing-library/react";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    expect(screen.getByText(/contact form/i));
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const fnameInput = screen.getByPlaceholderText("Edd");
    userEvent.type(fnameInput, "Jaco");
    expect(fnameInput).toHaveValue();
    expect(fnameInput).not.toBeFalsy();
    await waitFor(() => {
        expect(screen.getByTestId("error")).toHaveTextContent(/Error: firstName must have at least 5 characters./i);
        expect(screen.getByTestId).toBeTruthy();
    })
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)
    const submit = screen.getByRole("button");
    fireEvent.click(submit);
    await waitFor(() => {
        const errors = screen.getAllByTestId("error");
        const error1 = screen.queryByText(/Error: firstName must have at least 5 characters./i)
        expect(error1).toBeVisible();
        expect(error1).toHaveTextContent(/Error: firstName must have at least 5 characters./i);
        const error2 = screen.queryByText(/Error: lastName is a required field./i);
        expect(error2).toBeVisible();
        expect(error2).toHaveTextContent(/Error: lastName is a required field./i);
        const error3 = screen.queryByText(/Error: email must be a valid email address./i)
        expect(error3).toBeVisible();
        expect(error3).toHaveTextContent(/Error: email must be a valid email address./i)
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const fname = screen.getByPlaceholderText("Edd");
    const lname = screen.getByPlaceholderText("Burke");
    userEvent.type(fname, "Jacob");
    userEvent.type(lname, "Lang");
    const submit = screen.getByRole("button");
    fireEvent.click(submit);
    await waitFor(() => {
        const error1 = screen.queryByText(/Error: firstName must have at least 5 characters./i)
        expect(error1).toBeFalsy();
        const erro2 = screen.queryByText(/Error: lastName is a required field./i);
        expect(erro2).toBeFalsy();
        const error3 = screen.queryByText(/Error: email must be a valid email address./i)
        expect(error3).toBeVisible();
        expect(error3).toHaveTextContent(/Error: email must be a valid email address./i)
    })
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const email = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i);
    userEvent.type(email, "i");
    await waitFor(() => {
        const error = screen.getByTestId("error")
        expect(error).toHaveTextContent(/Error: email must be a valid email address./i)
    })
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const fname = screen.getByPlaceholderText("Edd");
    const email = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i);
    userEvent.type(fname, "Jacob");
    userEvent.type(email, "bluebill1049@hotmail.com");
    const submit = screen.getByRole("button");
    fireEvent.click(submit);
    await waitFor(()=> {
        expect(screen.getByTestId("error")).toHaveTextContent(/Error: lastName is a required field./i);
    })
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>)
    const fname = screen.getByPlaceholderText("Edd");
    const email = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i);
    const lname = screen.getByPlaceholderText("Burke");
    userEvent.type(fname, "Jacob");
    userEvent.type(lname,"Lang")
    userEvent.type(email, "bluebill1049@hotmail.com");
    const submit = screen.getByRole("button");
    fireEvent.click(submit);
    await waitFor(()=> {
        const message = screen.queryByTestId("messageDisplay");
        expect(message).toBeFalsy();
        expect(message).not.toBeInTheDocument()
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);
    const fname = screen.getByPlaceholderText(/Edd/i);
    const lname = screen.getByPlaceholderText(/Burke/i);
    const email = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i)
    const message = screen.getByLabelText(/message/i);
    const submit = screen.getByRole("button");
    userEvent.type(fname,"Jacob")
    userEvent.type(lname,"Lang")
    userEvent.type(email,"bluebill1049@hotmail.com")
    userEvent.type(message,"This is a message and I can write whatever I want")
    fireEvent.click(submit);
    await waitFor(()=> {
        expect(screen.getByTestId("firstnameDisplay")).toHaveTextContent("Jacob");
        expect(screen.getByTestId("lastnameDisplay")).toHaveTextContent("Lang");
        expect(screen.getByTestId("emailDisplay")).toHaveTextContent("bluebill1049@hotmail.com");
        expect(screen.getByTestId("messageDisplay")).toHaveTextContent("This is a message and I can write whatever I want");
    })
});
