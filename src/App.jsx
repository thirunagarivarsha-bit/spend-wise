import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import AddExpense from "./pages/AddExpense";
import ExpenseLog from "./pages/ExpenseLog";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";

import ProtectedRoute from "./routes/ProtectedRoute";
import ExpenseDetails from "./pages/ExpenseDetails";

import MonthlyReport from "./pages/MonthlyReport";

function App() {
  return (
    <BrowserRouter>

      <Routes>

     <Route
 path="/"
 element={<Dashboard />}
/>

<Route
 path="/add-expense"
 element={<AddExpense />}
/>

<Route
 path="/expense-log"
 element={<ExpenseLog />}
/>

<Route
 path="/analytics"
 element={<Analytics />}
/>

<Route
 path="/expense/:id"
 element={<ExpenseDetails />}
/>

<Route
 path="/reports"
 element={<Reports />}
>
 <Route
  path="monthly"
  element={<MonthlyReport />}
 />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;