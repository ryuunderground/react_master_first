import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Screens/Home";
import About from "./Screens/About";
import NotFound from "./Screens/NotFound";
import ErrorComponenet from "./components/ErrorComponent";
import User from "./Screens/Users/User";
import Followers from "./Screens/Users/Followers";

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
      {
        path: "users/:userId",
        element: <User />,
        children: [
          {
            path: "followers",
            element: <Followers />,
          },
        ],
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
