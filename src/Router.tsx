import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Screens/Home";
import About from "./Screens/About";
import NotFound from "./Screens/NotFound";
import ErrorComponenet from "./components/ErrorComponent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
        errorElement: <ErrorComponenet />,
      },
      {
        path: "about",
        element: <About />,
        errorElement: <ErrorComponenet />,
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
