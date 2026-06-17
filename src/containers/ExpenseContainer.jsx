import { useContext } from "react";

import {
  ExpenseContext,
} from "../context/ExpenseContext";

import ExpensePresenter from "../presenters/ExpensePresenter";

function ExpenseContainer() {
  const { expenses } =
    useContext(ExpenseContext);

  return (
    <ExpensePresenter
      expenses={expenses}
    />
  );
}

export default ExpenseContainer;