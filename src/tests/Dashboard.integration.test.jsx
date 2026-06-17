import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";

import { ExpenseContext } from "../context/ExpenseContext";

import "@testing-library/jest-dom";

test("dashboard loads correctly", () => {
  render(
    <ExpenseContext.Provider
      value={{
        expenses: [],
      }}
    >
      <Dashboard />
    </ExpenseContext.Provider>
  );

  expect(
    screen.getByText(
      "SpendWise Dashboard"
    )
  ).toBeInTheDocument();
});