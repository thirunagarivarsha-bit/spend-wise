import { Link } from "react-router-dom";

function ExpenseItem({
  expense,
  deleteExpense,
}) {
  return (
    <li>
      <Link
        to={`/expense/${expense.id}`}
      >
        <strong>
          {expense.title}
        </strong>
      </Link>

      {" | ₹"}
      {expense.amount}

      {" | "}
      {expense.category}

      <button
        onClick={() =>
          deleteExpense(expense.id)
        }
      >
        Delete
      </button>
    </li>
  );
}

export default ExpenseItem;