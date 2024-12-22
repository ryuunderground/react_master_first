import { getTvGenres } from "../api";
import styled from "styled-components";
import { useQuery } from "react-query";

interface ITvGenresProps {
  id: number;
}

interface ITvGenre {
  id: number;
  name: string;
}

interface ITvGenres {
  id: number;
  results: ITvGenre[];
}
const Genre = styled.div`
  width: 100%;
`;
const Keywords = styled.ul`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  margin-top: 80px;
`;
const Keyword = styled.li`
  width: auto;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.black.lighter};
  font-size: 16px;
  padding: 15px 10px;
  border-radius: 5px;
  opacity: 0.8;
`;

const TvGenres = ({ id }: ITvGenresProps) => {
  const { data: movieGenres, isLoading: movieLoading } = useQuery<ITvGenres>(
    ["genres", "TvGenres"],
    () => getTvGenres(id, "en-US")
  );

  return (
    <Genre>
      <Keywords>
        {movieGenres?.results.slice(0, 4).map((keyword) => (
          <Keyword key={keyword.id}>{keyword.name}</Keyword>
        ))}
      </Keywords>
    </Genre>
  );
};

export default TvGenres;
