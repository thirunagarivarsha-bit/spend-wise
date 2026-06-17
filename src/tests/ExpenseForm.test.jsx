import { render, screen } from "@testing-library/react";
import ExpenseForm from "../components/ExpenseForm";
import { ExpenseContext } from "../context/ExpenseContext";

import "@testing-library/jest-dom";

test("renders expense form", () => {
  render(
    <ExpenseContext.Provider
      value={{
        addExpense: () => {},
      }}
    >
      <ExpenseForm />
    </ExpenseContext.Provider>
  );

  expect(
    screen.getByPlaceholderText(
      "Expense Name"
    )
  ).toBeInTheDocument();
});