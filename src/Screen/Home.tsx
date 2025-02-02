import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import Reviews from "../components/Reviews";
import Genres from "../components/Genres";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 100px;
  margin-top: 225px;
`;
const Overview = styled.p`
  font-size: 20px;
  width: 50%;
`;
const Sliders = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 200px;
`;
const SliderTitle = styled.h1`
  font-size: 26px;
  padding: 10px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;
const ArrowBtn = styled.button`
  height: 26px;
  width: 26px;
  background-color: transparent;
  border: 1px solid #ffffff;
  border-radius: 50%;
  color: white;
`;
const Slider = styled.div`
  position: relative;
  top: -100px;
  height: 100%;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  width: 100%;
  font-size: 36px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  position: relative;
  min-width: 200px;

  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px 0;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  width: 100%;

  h4 {
    text-align: center;
    font-size: 12px;
    width: 100%;
  }
`;

const BigMovie = styled(motion.div)`
  background-color: ${(props) => props.theme.black.darker};
  position: absolute;
  width: 80vw;
  min-width: 600px;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center top;
  height: 500px;
  position: relative;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 100px;
  font-weight: 800;
  position: absolute;
  top: 340px;
  z-index: 99;
  white-space: nowrap;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: 0;
  color: ${(props) => props.theme.white.lighter};
  height: auto;
  margin-top: 30px;
`;
const BigContents = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  z-index: 98;
`;
/* const ReviewButton = styled.button`
  font-size: 24px;
`; */

const Error = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: 0;
`;
const ErrorMessage = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 24px;
`;

//Variants
const rowVars = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -1 * window.outerWidth - 10,
  },
};
const boxVars = {
  normal: {
    scale: 1,
    zIndex: 60,
  },
  hover: {
    scale: 1.3,
    y: -20,
    transition: {
      delay: 0.2,
      type: "tween",
      duration: 0.3,
    },
    zIndex: 98,
  },
};
const infoVars = {
  hover: {
    opacity: 1,
    zIndex: 99,

    transition: {
      delay: 0.2,
      type: "tween",
      duration: 0.3,
    },
  },
};

//main Fn
const Home = () => {
  const navigate = useNavigate();
  const bigMovieMatchNP = useMatch("/moviesNP/:movieId");
  const bigMovieMatchUP = useMatch("/moviesUP/:movieId");
  const bigMovieMatchTR = useMatch("/moviesTR/:movieId");
  const bigMovieMatchP = useMatch("/moviesP/:movieId");
  const { scrollY } = useScroll();
  const { data: movieNowPlaying, isLoading: movieNowLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], () =>
      getMovies("en-US", "now_playing")
    );
  const { data: movieUpcoming, isLoading: movieUpLoading } =
    useQuery<IGetMoviesResult>(["movies", "upcoming"], () =>
      getMovies("en-US", "upcoming")
    );
  const { data: movieTopRated, isLoading: movieTopLoading } =
    useQuery<IGetMoviesResult>(["movies", "topRated"], () =>
      getMovies("en-US", "top_rated")
    );
  const { data: moviePopular, isLoading: moviePopularLoading } =
    useQuery<IGetMoviesResult>(["movies", "popular"], () =>
      getMovies("en-US", "popular")
    );

  const [indexNP, setIndexNP] = useState(0);
  const [indexUP, setIndexUP] = useState(0);
  const [indexTR, setIndexTR] = useState(0);
  const [indexP, setIndexP] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const increaseIndexNP = () => {
    if (movieNowPlaying) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = movieNowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexNP((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndexUp = () => {
    if (movieUpcoming) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = movieUpcoming.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexUP((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndexTR = () => {
    if (movieTopRated) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = movieTopRated.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexTR((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndexP = () => {
    if (moviePopular) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = moviePopular.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexP((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndexNP = () => {
    if (movieNowPlaying) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = movieNowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexNP((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const decreaseIndexUP = () => {
    if (movieUpcoming) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = movieUpcoming.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexUP((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const decreaseIndexTR = () => {
    if (movieTopRated) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = movieTopRated.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexTR((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const decreaseIndexP = () => {
    if (moviePopular) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = moviePopular.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexP((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => {
    setIsLeaving((prev) => !prev);
  };
  const offset = 6;
  const onBoxClickedNP = (movieId: number) => {
    navigate(`/moviesNP/${movieId}`);
  };
  const onBoxClickedUP = (movieId: number) => {
    navigate(`/moviesUP/${movieId}`);
  };
  const onBoxClickedTR = (movieId: number) => {
    navigate(`/moviesTR/${movieId}`);
  };
  const onBoxClickedP = (movieId: number) => {
    navigate(`/moviesP/${movieId}`);
  };

  const onOverlayClicked = () => {
    navigate(-1);
  };

  /*   const goToReview = (movieId: number) => {
    navigate(`/moviereview/${movieId}`);
  }; */

  const clickedMovieNP =
    bigMovieMatchNP?.params.movieId &&
    movieNowPlaying?.results.find(
      (movie) => movie.id === +bigMovieMatchNP?.params.movieId!
    );

  const clickedMovieUP =
    bigMovieMatchUP?.params.movieId &&
    movieUpcoming?.results.find(
      (movie) => movie.id === +bigMovieMatchUP?.params.movieId!
    );

  const clickedMovieTR =
    bigMovieMatchTR?.params.movieId &&
    movieTopRated?.results.find(
      (movie) => movie.id === +bigMovieMatchTR?.params.movieId!
    );
  const clickedMovieP =
    bigMovieMatchP?.params.movieId &&
    moviePopular?.results.find(
      (movie) => movie.id === +bigMovieMatchP?.params.movieId!
    );

  return (
    <Wrapper>
      {movieNowLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              movieNowPlaying?.results[0].backdrop_path || ""
            )}
          >
            <Title>{movieNowPlaying?.results[0].title}</Title>
            <Overview>{movieNowPlaying?.results[0].overview}</Overview>
          </Banner>
          <Sliders>
            {/* Now Playing*/}
            <Slider>
              <SliderTitle>
                <ArrowBtn onClick={decreaseIndexNP}>&lt;</ArrowBtn>Now Playing
                <ArrowBtn onClick={increaseIndexNP}>&gt;</ArrowBtn>
              </SliderTitle>

              <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
                <Row
                  variants={rowVars}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={indexNP}
                >
                  {movieNowPlaying?.results
                    .slice(1)
                    .slice(offset * indexNP, offset * indexNP + offset)
                    .map((movie) => (
                      <Box
                        layoutId={`${movie.id}NP`}
                        key={`${movie.id}NP`}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVars}
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClickedNP(movie.id)}
                      >
                        <Info variants={infoVars}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {bigMovieMatchNP ? (
                <>
                  <Overlay
                    onClick={onOverlayClicked}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  ></Overlay>
                  <BigMovie
                    layoutId={bigMovieMatchNP?.params.movieId + ""}
                    style={{ top: scrollY.get() + 100 }}
                  >
                    {clickedMovieNP ? (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, #181818, transparent), url(${makeImagePath(
                              clickedMovieNP.backdrop_path,
                              "w500"
                            )})`,
                          }}
                        />
                        <BigTitle>{clickedMovieNP.title}</BigTitle>
                        <BigContents>
                          <Genres id={clickedMovieNP.id} />
                          <BigOverview>
                            {clickedMovieNP.overview || "No overview settled"}
                          </BigOverview>
                        </BigContents>

                        {/*  <ReviewButton
                          onClick={() => goToReview(clickedMovieNP.id)}
                        >
                          Review
                        </ReviewButton> */}
                      </>
                    ) : (
                      <>
                        <Error>404 Error &#40;</Error>
                        <ErrorMessage>Sorry. Cannot load</ErrorMessage>
                      </>
                    )}
                  </BigMovie>
                </>
              ) : null}
            </AnimatePresence>
            {/* Upcoming*/}
            {movieUpLoading ? (
              <Loader>Loading...</Loader>
            ) : (
              <>
                <Slider>
                  <SliderTitle>
                    <ArrowBtn onClick={decreaseIndexUP}>&lt;</ArrowBtn>Upcoming
                    <ArrowBtn onClick={increaseIndexUp}>&gt;</ArrowBtn>
                  </SliderTitle>
                  <AnimatePresence
                    onExitComplete={toggleLeaving}
                    initial={false}
                  >
                    <Row
                      variants={rowVars}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ type: "tween", duration: 1 }}
                      key={indexUP}
                    >
                      {movieUpcoming?.results
                        .slice(1)
                        .slice(offset * indexUP, offset * indexUP + offset)
                        .map((movie) => (
                          <Box
                            layoutId={`${movie.id}UP`}
                            key={`${movie.id}UP`}
                            bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClickedUP(movie.id)}
                          >
                            <Info variants={infoVars}>
                              <h4>{movie.title}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                </Slider>
                <AnimatePresence>
                  {bigMovieMatchUP ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <BigMovie
                        layoutId={bigMovieMatchUP?.params.movieId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedMovieUP ? (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, #181818, transparent), url(${makeImagePath(
                                  clickedMovieUP.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedMovieUP.title}</BigTitle>
                            <BigContents>
                              <Genres id={clickedMovieUP.id} />
                              <BigOverview>
                                {clickedMovieUP.overview ||
                                  "No overview settled"}
                              </BigOverview>
                            </BigContents>
                          </>
                        ) : (
                          <>
                            <Error>Undefined ID &40;</Error>
                            <ErrorMessage>Sorry. Cannot load</ErrorMessage>
                          </>
                        )}
                      </BigMovie>
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}
            {/* Top Rated*/}
            {movieTopLoading ? (
              <Loader>Loading...</Loader>
            ) : (
              <>
                <Slider>
                  <SliderTitle>
                    <ArrowBtn onClick={decreaseIndexTR}>&lt;</ArrowBtn>Top Rated
                    <ArrowBtn onClick={increaseIndexTR}>&gt;</ArrowBtn>
                  </SliderTitle>
                  <AnimatePresence
                    onExitComplete={toggleLeaving}
                    initial={false}
                  >
                    <Row
                      variants={rowVars}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ type: "tween", duration: 1 }}
                      key={indexTR}
                    >
                      {movieTopRated?.results
                        .slice(1)
                        .slice(offset * indexTR, offset * indexTR + offset)
                        .map((movie) => (
                          <Box
                            layoutId={`${movie.id}TR`}
                            key={`${movie.id}TR`}
                            bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClickedTR(movie.id)}
                          >
                            <Info variants={infoVars}>
                              <h4>{movie.title}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                </Slider>
                <AnimatePresence>
                  {bigMovieMatchTR ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <BigMovie
                        layoutId={bigMovieMatchTR?.params.movieId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedMovieTR ? (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, #181818, transparent), url(${makeImagePath(
                                  clickedMovieTR.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedMovieTR.title}</BigTitle>
                            <BigContents>
                              <Genres id={clickedMovieTR.id} />
                              <BigOverview>
                                {clickedMovieTR.overview ||
                                  "No overview settled"}
                              </BigOverview>
                            </BigContents>
                          </>
                        ) : (
                          <>
                            <Error>404 Error : &#40;</Error>
                            <ErrorMessage>
                              Sorry. Id from API might not same with chosen
                              movie
                            </ErrorMessage>
                          </>
                        )}
                      </BigMovie>
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}
            {/* Popular */}
            {moviePopularLoading ? (
              <Loader>Loading...</Loader>
            ) : (
              <>
                <Slider>
                  <SliderTitle>
                    <ArrowBtn onClick={decreaseIndexP}>&lt;</ArrowBtn>Popular
                    <ArrowBtn onClick={increaseIndexP}>&gt;</ArrowBtn>
                  </SliderTitle>
                  <AnimatePresence
                    onExitComplete={toggleLeaving}
                    initial={false}
                  >
                    <Row
                      variants={rowVars}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ type: "tween", duration: 1 }}
                      key={indexP}
                    >
                      {moviePopular?.results
                        .slice(1)
                        .slice(offset * indexP, offset * indexP + offset)
                        .map((movie) => (
                          <Box
                            layoutId={`${movie.id}P`}
                            key={`${movie.id}P`}
                            bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClickedP(movie.id)}
                          >
                            <Info variants={infoVars}>
                              <h4>{movie.title}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                </Slider>
                <AnimatePresence>
                  {bigMovieMatchP ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <BigMovie
                        layoutId={bigMovieMatchP?.params.movieId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedMovieP ? (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, #181818, transparent), url(${makeImagePath(
                                  clickedMovieP.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedMovieP.title}</BigTitle>
                            <BigContents>
                              <Genres id={clickedMovieP.id} />
                              <BigOverview>
                                {clickedMovieP.overview ||
                                  "No overview settled"}
                              </BigOverview>
                            </BigContents>
                          </>
                        ) : (
                          <>
                            <Error> ErrorPopular :&#40;</Error>
                            <ErrorMessage>
                              Sorry. Id from API might not same with chosen
                              movie
                            </ErrorMessage>
                          </>
                        )}
                      </BigMovie>
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}
          </Sliders>
        </>
      )}

      <ReactQueryDevtools initialIsOpen={true} />
    </Wrapper>
  );
};

export default Home;
