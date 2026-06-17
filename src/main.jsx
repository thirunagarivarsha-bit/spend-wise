import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import {
  ExpenseProvider,
} from "./context/ExpenseContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <ExpenseProvider>
    <App />
  </ExpenseProvider>
);