import { render, screen } from "@testing-library/react";
import ExpensePresenter from "../presenters/ExpensePresenter";

import "@testing-library/jest-dom";

test("renders expense data", () => {
  render(
    <ExpensePresenter
      expenses={[
        {
          id: 1,
          title: "Food",
          amount: 200,
        },
      ]}
    />
  );

  expect(
    screen.getByText("Food - ₹200")
  ).toBeInTheDocument();
});