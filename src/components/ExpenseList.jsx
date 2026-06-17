import { useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import ExpenseItem from "./ExpenseItem";

function ExpenseList({ expenses }) {
  const { deleteExpense } =
    useContext(ExpenseContext);

  return (
    <>
      <h2>Expense List</h2>

      {expenses.length === 0 ? (
        <p>No matching expenses found</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              deleteExpense={deleteExpense}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default ExpenseList;