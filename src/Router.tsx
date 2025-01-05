import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Screen/Home";
import ErrorComponenet from "./components/ErrorComponent";
import NotFound from "./components/NotFound";
import Tv from "./Screen/Tv";
import Search from "./Screen/Search";
import Reviews from "./components/Reviews";
import ReviewScreen from "./Screen/ReviewScreen";

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
        path: "moviesNP/:movieId",
        element: <Home />,
        errorElement: <ErrorComponenet />,
      },
      {
        path: "moviesUP/:movieId",
        element: <Home />,
        errorElement: <ErrorComponenet />,
      },
      {
        path: "moviesTR/:movieId",
        element: <Home />,
        errorElement: <ErrorComponenet />,
      },
      {
        path: "moviesP/:movieId",
        element: <Home />,
        errorElement: <ErrorComponenet />,
      },

      {
        path: "tv/",
        element: <Tv />,
        errorElement: <ErrorComponenet />,
        children: [
          {
            path: "Now/:showId",
            element: <Tv />,
            errorElement: <ErrorComponenet />,
          },
          {
            path: "On/:showId",
            element: <Tv />,
            errorElement: <ErrorComponenet />,
          },
          {
            path: "Top/:showId",
            element: <Tv />,
            errorElement: <ErrorComponenet />,
          },
          {
            path: "Pop/:showId",
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
