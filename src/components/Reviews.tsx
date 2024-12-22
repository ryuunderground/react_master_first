import { getMovieReviews } from "../api";
import styled from "styled-components";
import { useQuery } from "react-query";

interface IReviewProps {
  id: number;
}

interface IReview {
  author: string;
  content: string;
  updated_at: string;
}

interface IReviews {
  id: number;
  page: number;
  results: IReview[];
}
const Review = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  gap: 10px;
`;
const Each = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  hr {
    width: 95%;
  }
`;
const Header = styled.header`
  width: 100%;
  display: flex;
  gap: 20%;
  justify-content: flex-start;
  align-items: center;
`;
const Reviewr = styled.span`
  font-size: 14px;
`;
const Content = styled.p`
  font-size: 16px;
`;
const Update = styled.p`
  font-size: 14px;
`;
const NoReview = styled.div`
  width: 100%;
  height: 100%;
`;
const NoReviewMessage = styled.h1``;
const Reviews = ({ id }: IReviewProps) => {
  const { data: movieReviews, isLoading: movieReviewLoading } =
    useQuery<IReviews>(["reviews", "MovieReviews"], () =>
      getMovieReviews(id, "en-US")
    );
  const Fhalf = (nickname: string) => {
    const length = nickname.length;
    const halfLength = Math.floor(length / 2);
    const visible = nickname.slice(0, halfLength);
    const maksed = "*".repeat(length - halfLength);
    return visible + maksed;
  };
  return (
    <Review>
      {movieReviews?.results.length != 0 ? (
        movieReviews?.results.map((review) => (
          <Each key={review.updated_at}>
            <Header>
              <Reviewr>author: {Fhalf(review.author)}</Reviewr>
              <Update>updated at: {review.updated_at.slice(0, 10)}</Update>
            </Header>
            <Content>
              {review.content.length > 100
                ? `${review.content.slice(0, 97)}...`
                : review.content}
            </Content>
            <hr />
          </Each>
        ))
      ) : (
        <NoReview>
          <NoReviewMessage>No Reviews Updated</NoReviewMessage>
        </NoReview>
      )}
    </Review>
  );
};

export default Reviews;
