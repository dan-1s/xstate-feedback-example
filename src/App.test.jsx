import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the feedback trigger", () => {
  render(<App />);
  expect(screen.getByRole("button", { name: /feedback/i })).toBeInTheDocument();
});
