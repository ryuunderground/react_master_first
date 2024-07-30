import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useQuery } from "react-query";
import { coinFetcher } from "../api";
import { Helmet } from "react-helmet";

const Container = styled.div`
  padding: 0 20px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Coin = styled.li`
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  padding: 20px;
  border-radius: 15px;
  a {
    transition: color 0.2s ease-in-out;
    display: flex;
    align-items: center;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
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

const CoinPic = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;

interface ICoins {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const Coins = () => {
  const { isLoading, data } = useQuery<ICoins[]>("allCoins", coinFetcher);
  /**
  const [coinsData, setCoinsData] = useState<ICoins[]>([]);
  const [Loading, setLoading] = useState(true);

  const getCoins = async () => {
    const res = await axios("https://api.coinpaprika.com/v1/coins");
    setCoinsData(res.data.slice(0, 100));
    setLoading(false);
  };

  useEffect(() => {
    getCoins();
  }, []); */
  return (
    <Container>
      <Helmet>
        <title>Coins</title>
      </Helmet>
      <Header>
        <Title>Coins</Title>
      </Header>
      {isLoading ? (
        <LoadingText>Loading....</LoadingText>
      ) : (
        <CoinsList>
          {data?.map((coin) => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`} state={{ name: coin.name }}>
                <CoinPic
                  src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
};

export default Coins;
