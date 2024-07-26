import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface IPrices {
  close: string;
  high: string;
  low: string;
  market_cap: number;
  open: string;
  time_close: number;
  time_open: number;
  volume: string;
}

interface RouterState {
  name: string;
}

const Container = styled.div`
  padding: 0 20px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
`;

const LoadingText = styled.h1`
  color: ${(props) => props.theme.textColor};
  font-size: 36px;
  text-align: center;
  margin-top: 24px;
`;

const Main = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;
const PriceList = styled.ul`
  display: flex;
  justify-content: center;
  width: 80%;
  gap: 48px;
`;

const PriceContent = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: #000;
  padding: 18px;
  border-radius: 5px;
`;

const PriceTitle = styled.h2`
  font-size: 18px;
`;
const ContentPrice = styled.span`
  font-size: 24px;
`;

const Coin = () => {
  const { coinId } = useParams();
  const [Loading, setLoading] = useState(true);
  const [priceInfo, setPriceInfo] = useState<IPrices[]>([]);
  const location = useLocation();
  const states = location.state as RouterState;

  const getCoinPrice = async () => {
    const priceRes = await axios(
      `https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`
    );
    setPriceInfo(priceRes.data);
    console.log(priceRes.data);
    setLoading(false);
  };
  useEffect(() => {
    getCoinPrice();
  }, []);
  return (
    <Container>
      <Header>
        <Title>{states?.name || "Loading...."}</Title>
      </Header>
      {Loading ? (
        <LoadingText>Loading....</LoadingText>
      ) : (
        <Main>
          {priceInfo.map((info) => (
            <PriceList>
              <PriceContent>
                <PriceTitle>close :</PriceTitle>
                <ContentPrice>{info.close}</ContentPrice>
              </PriceContent>
              <PriceContent>
                <PriceTitle>open :</PriceTitle>
                <ContentPrice>{info.open}</ContentPrice>
              </PriceContent>
              <PriceContent>
                <PriceTitle>high :</PriceTitle>
                <ContentPrice>{info.high}</ContentPrice>
              </PriceContent>
              <PriceContent>
                <PriceTitle>low :</PriceTitle>
                <ContentPrice>{info.low}</ContentPrice>
              </PriceContent>
            </PriceList>
          ))}
        </Main>
      )}
    </Container>
  );
};

export default Coin;
