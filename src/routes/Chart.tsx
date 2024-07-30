import { useOutletContext } from "react-router-dom";
import { historyFetcher } from "../api";
import { useQuery } from "react-query";
import ApexChart from "react-apexcharts";

interface ICoinData {
  coinId: string;
}

interface IHistoryData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

const Chart = () => {
  const coinData = useOutletContext<ICoinData>();
  const coinId = coinData.coinId;
  const { isLoading, data } = useQuery<IHistoryData[]>(["ohlcv", coinId], () =>
    historyFetcher(coinId)
  );
  const PriceData = data?.map((price) => Number(price.close));
  return (
    <div>
      {isLoading ? (
        "Is Loading"
      ) : (
        <>
          <ApexChart
            type="line"
            series={[
              {
                name: "price",
                data: PriceData !== undefined ? PriceData : [],
              },
            ]}
            options={{
              theme: {
                mode: "dark",
              },
              chart: {
                width: "400px",
                height: "auto",
                toolbar: {
                  show: false,
                },
                background: "transparent",
              },
              grid: {
                show: false,
              },
              stroke: {
                curve: "smooth",
                width: 3,
              },
              xaxis: {
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
                labels: {
                  show: false,
                },
                categories: data?.map((price) =>
                  new Date(Number(price.time_close * 1000)).toUTCString()
                ),
              },
              yaxis: {
                show: false,
              },
              fill: {
                type: "gradient",
                gradient: {
                  gradientToColors: ["#0be881"],
                  stops: [0, 100],
                },
              },
              colors: ["#0fbcf9"],
              tooltip: {
                y: {
                  formatter: (v) => `$ ${v.toFixed(3)}`,
                },
              },
            }}
          />
        </>
      )}
    </div>
  );
};

export default Chart;
