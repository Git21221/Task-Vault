import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signin from "./pages/Signin.jsx";
import Home from "./pages/user/Home.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <App />
  </Provider>
);
