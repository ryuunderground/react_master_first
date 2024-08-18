import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { off } from "process";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 10px;
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
`;
const Slider = styled.div`
  position: relative;
  top: -100px;
  height: 100%;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  font-size: 36px;
  background-image: url(${(props) => props.bgPhoto});
  background: cover;
  background-position: center center;
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
  h4 {
    text-align: center;
    font-size: 12px;
  }
`;

const BigMovie = styled(motion.div)`
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 300px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
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
  },
  hover: {
    scale: 1.3,
    y: -20,
    transition: {
      delay: 0.2,
      type: "tween",
      duration: 0.3,
    },
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
  const bigMovieMatch = useMatch("react_master_graduate/movies/:movieId");
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
  const [index, setIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const increaseIndex = () => {
    if (movieNowPlaying) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = movieNowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    setIsLeaving((prev) => !prev);
  };
  const offset = 6;
  const onBoxClicked = (movieId: number) => {
    navigate(`/react_master_graduate/movies/${movieId}`);
  };
  const onOverlayClicked = () => {
    navigate(-1);
  };
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    movieNowPlaying?.results.find(
      (movie) => String(movie.id) === bigMovieMatch?.params.movieId
    );

  return (
    <Wrapper>
      {movieNowLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(
              movieNowPlaying?.results[0].backdrop_path || ""
            )}
          >
            <Title>{movieNowPlaying?.results[0].title}</Title>
            <Overview>{movieNowPlaying?.results[0].overview}</Overview>
          </Banner>
          <Sliders>
            {/* Now Playing*/}
            <Slider>
              <SliderTitle>Now Playing</SliderTitle>
              <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
                <Row
                  variants={rowVars}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                >
                  {movieNowPlaying?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVars}
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClicked(movie.id)}
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
              {bigMovieMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClicked}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  ></Overlay>
                  <BigMovie
                    layoutId={bigMovieMatch?.params.movieId + ""}
                    style={{ top: scrollY.get() + 100 }}
                  >
                    {clickedMovie && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              clickedMovie.backdrop_path,
                              "w500"
                            )})`,
                          }}
                        />
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
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
                  <SliderTitle>Upcoming</SliderTitle>
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
                      key={index}
                    >
                      {movieUpcoming?.results
                        .slice(1)
                        .slice(offset * index, offset * index + offset)
                        .map((movie) => (
                          <Box
                            layoutId={movie.id + ""}
                            key={movie.id}
                            bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClicked(movie.id)}
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
                  {bigMovieMatch ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <BigMovie
                        layoutId={bigMovieMatch?.params.movieId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedMovie && (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedMovie.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedMovie.title}</BigTitle>
                            <BigOverview>{clickedMovie.overview}</BigOverview>
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
                  <SliderTitle>Top Rated</SliderTitle>
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
                      key={index}
                    >
                      {movieTopRated?.results
                        .slice(1)
                        .slice(offset * index, offset * index + offset)
                        .map((movie) => (
                          <Box
                            layoutId={movie.id + ""}
                            key={movie.id}
                            bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClicked(movie.id)}
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
                  {bigMovieMatch ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <BigMovie
                        layoutId={bigMovieMatch?.params.movieId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedMovie && (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedMovie.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedMovie.title}</BigTitle>
                            <BigOverview>{clickedMovie.overview}</BigOverview>
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
                  <SliderTitle>Popular</SliderTitle>
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
                      key={index}
                    >
                      {moviePopular?.results
                        .slice(1)
                        .slice(offset * index, offset * index + offset)
                        .map((movie) => (
                          <Box
                            layoutId={movie.id + ""}
                            key={movie.id}
                            bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClicked(movie.id)}
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
                  {bigMovieMatch ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <BigMovie
                        layoutId={bigMovieMatch?.params.movieId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedMovie && (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedMovie.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedMovie.title}</BigTitle>
                            <BigOverview>{clickedMovie.overview}</BigOverview>
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
