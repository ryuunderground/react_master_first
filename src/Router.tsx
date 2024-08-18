import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Screen/Home";
import ErrorComponenet from "./components/ErrorComponent";
import NotFound from "./components/NotFound";
import Tv from "./Screen/Tv";
import Search from "./Screen/Search";

const router = createBrowserRouter([
  {
    path: "/react_master_graduate/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
        errorElement: <ErrorComponenet />,
      },
      {
        path: "movies/:movieId",
        element: <Home />,
        errorElement: <ErrorComponenet />,
      },
      {
        path: "tv/",
        element: <Tv />,
        errorElement: <ErrorComponenet />,
        children: [
          {
            path: ":showId",
            element: <Tv />,
            errorElement: <ErrorComponenet />,
          },
        ],
      },
      {
        path: "search/",
        element: <Search />,
        errorElement: <ErrorComponenet />,
        children: [
          {
            path: ":showId",
            element: <Tv />,
            errorElement: <ErrorComponenet />,
          },
        ],
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
