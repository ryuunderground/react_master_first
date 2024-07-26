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
        path: "",
        element: <Coins />,
        errorElement: <ErrorComponenet />,
      },
      {
        path: ":coinId",
        element: <Coin />,
        errorElement: <ErrorComponenet />,
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
