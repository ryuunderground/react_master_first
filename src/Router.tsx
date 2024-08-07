import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Coins from "./routes/Coins";
import Coin from "./routes/Coin";
import ErrorComponenet from "./components/ErrorComponent";
import NotFound from "./Screens/NotFound";
import Price from "./routes/Price";
import Chart from "./routes/Chart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "react_master",
        element: <Coins />,
        errorElement: <ErrorComponenet />,
      },
      {
        path: "react_master/:coinId",
        element: <Coin />,
        errorElement: <ErrorComponenet />,
        children: [
          {
            path: "Price",
            element: <Price />,
            errorElement: <ErrorComponenet />,
          },
          {
            path: "Chart",
            element: <Chart />,
            errorElement: <ErrorComponenet />,
          },
        ],
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
