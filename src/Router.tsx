import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Screens/Home";
import About from "./Screens/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

export default router;
