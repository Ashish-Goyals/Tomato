import Login from "./pages/Login";
import Home from "./pages/Home";
import SelectRole from "./pages/SelectRole";
import Account from "./pages/Account";
import Address from "./pages/Address";
import Order from "./pages/Order";
export const publicRoutes = [{ path: "/login", element: <Login /> }];

export const protectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "/select-role", element: <SelectRole /> },
  { path: "/account", element: <Account /> },
  { path: "/address", element: <Address /> },
  { path: "/orders", element: <Order /> },
  { path: "/cart", element: <Order /> },
];
