import { createBrowserRouter } from "react-router-dom";
import Home from "./layout/Home";
import Form from "./layout/Form";
import FormDetail from "./layout/FormDetail";
import Admin from "./layout/Admin";
import Login from "./layout/Login";
import Dashboard from "./layout/Dahboard";

const router = createBrowserRouter([
  {
    path: "/", // Route ke halaman Home
    element: <Home />,
  },
  {
    path: "/form", // Route ke halaman Form
    element: <Form />,
  },
  {
    path: "/form-detail/:id", // Route untuk detail form (parameter ID)
    element: <FormDetail />,
  },
  {
    path: "/dashboard", // Route ke halaman Admin
    element: <Dashboard />,
  },
  {
    path: "/login", // Route ke halaman Login
    element: <Login />,
  },
]);

export default router;
