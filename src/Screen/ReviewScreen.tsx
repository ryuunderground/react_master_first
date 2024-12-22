import Reviews from "../components/Reviews";
import styled from "styled-components";

const ReviewBox = styled.div``;

const ReviewScreen = (movieId: number) => {
  return (
    <ReviewBox>
      <Reviews id={movieId} />
    </ReviewBox>
  );
};

export default ReviewScreen;
