import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { IGetTvsResult, getTvs } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
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
const ArrowBtn = styled.button`
  height: 26px;
  width: 26px;
  background-color: transparent;
  border: 1px solid #ffffff;
  border-radius: 50%;
  color: white;
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

const Bigtv = styled(motion.div)`
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  z-index: 99;
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
  z-index: 98;
`;

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
const Tv = () => {
  const navigate = useNavigate();
  const bigtvMatchNow = useMatch("react_master_graduate/tv/Now/:showId");
  const bigtvMatchOn = useMatch("react_master_graduate/tv/On/:showId");
  const bigtvMatchTop = useMatch("react_master_graduate/tv/Top/:showId");
  const bigtvMatchPop = useMatch("react_master_graduate/tv/Pop/:showId");
  const { scrollY } = useScroll();

  //정보 가져오기
  const { data: tvNowPlaying, isLoading: tvNowLoading } =
    useQuery<IGetTvsResult>(["tv", "nowPlaying"], () =>
      getTvs("en-US", "airing_today")
    );
  const { data: tvOncoming, isLoading: tvOnLoading } = useQuery<IGetTvsResult>(
    ["tv", "onTheAir"],
    () => getTvs("en-US", "on_the_air")
  );
  const { data: tvTopRated, isLoading: tvTopLoading } = useQuery<IGetTvsResult>(
    ["tv", "topRated"],
    () => getTvs("en-US", "top_rated")
  );
  const { data: tvPopular, isLoading: tvPopularLoading } =
    useQuery<IGetTvsResult>(["tv", "popular"], () =>
      getTvs("en-US", "popular")
    );

  //인덱스 넘기기
  const [indexNP, setIndexNP] = useState(0);
  const [indexUP, setIndexUP] = useState(0);
  const [indexTR, setIndexTR] = useState(0);
  const [indexP, setIndexP] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const increaseIndexNP = () => {
    if (tvNowPlaying) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = tvNowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexNP((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndexUP = () => {
    if (tvOncoming) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = tvOncoming.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexUP((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndexTR = () => {
    if (tvTopRated) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = tvTopRated.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexTR((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndexP = () => {
    if (tvPopular) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = tvPopular.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexP((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndexNP = () => {
    if (tvNowPlaying) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = tvNowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexNP((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const decreaseIndexUP = () => {
    if (tvOncoming) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = tvOncoming.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexUP((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const decreaseIndexTR = () => {
    if (tvTopRated) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = tvTopRated.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexTR((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const decreaseIndexP = () => {
    if (tvPopular) {
      if (isLeaving) return;
      toggleLeaving();
      const totalMovies = tvPopular.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexP((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => {
    setIsLeaving((prev) => !prev);
  };

  const offset = 6;
  const onBoxClickedNow = (showId: number) => {
    navigate(`/react_master_graduate/tv/Now/${showId}`);
  };
  const onBoxClickedOn = (showId: number) => {
    navigate(`/react_master_graduate/tv/On/${showId}`);
  };
  const onBoxClickedTop = (showId: number) => {
    navigate(`/react_master_graduate/tv/Top/${showId}`);
  };
  const onBoxClickedPop = (showId: number) => {
    navigate(`/react_master_graduate/tv/Pop/${showId}`);
  };
  const onOverlayClicked = () => {
    navigate(-1);
  };
  const clickedtvNow =
    bigtvMatchNow?.params.showId &&
    tvNowPlaying?.results.find(
      (tv) => String(tv.id) === bigtvMatchNow?.params.showId
    );
  const clickedtvOn =
    bigtvMatchOn?.params.showId &&
    tvOncoming?.results.find(
      (tv) => String(tv.id) === bigtvMatchOn?.params.showId
    );
  const clickedtvTop =
    bigtvMatchTop?.params.showId &&
    tvTopRated?.results.find(
      (tv) => String(tv.id) === bigtvMatchTop?.params.showId
    );
  const clickedtvPop =
    bigtvMatchPop?.params.showId &&
    tvPopular?.results.find(
      (tv) => String(tv.id) === bigtvMatchPop?.params.showId
    );

  return (
    <Wrapper>
      {tvNowLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndexNP}
            bgPhoto={makeImagePath(
              tvNowPlaying?.results[0].backdrop_path || ""
            )}
          >
            <Title>{tvNowPlaying?.results[0].original_name}</Title>
            <Overview>{tvNowPlaying?.results[0].overview}</Overview>
          </Banner>
          <Sliders>
            {/* Airing Today*/}
            <Slider>
              <SliderTitle>
                <ArrowBtn onClick={decreaseIndexNP}>&lt;</ArrowBtn>Airing Today
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
                  {tvNowPlaying?.results
                    .slice(1)
                    .slice(offset * indexNP, offset * indexNP + offset)
                    .map((tv) => (
                      <Box
                        layoutId={`${tv.id}NP`}
                        key={`${tv.id}NP`}
                        bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVars}
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClickedNow(tv.id)}
                      >
                        <Info variants={infoVars}>
                          <h4>{tv.original_name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {bigtvMatchNow ? (
                <>
                  <Overlay
                    onClick={onOverlayClicked}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  ></Overlay>
                  <Bigtv
                    layoutId={bigtvMatchNow?.params.showId + ""}
                    style={{ top: scrollY.get() + 100 }}
                  >
                    {clickedtvNow ? (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              clickedtvNow.backdrop_path,
                              "w500"
                            )})`,
                          }}
                        />
                        <BigTitle>{clickedtvNow.original_name}</BigTitle>
                        <BigOverview>
                          {clickedtvNow.overview || "No overview settled"}
                        </BigOverview>
                      </>
                    ) : (
                      <>
                        <Error>404 Error &#40;</Error>
                        <ErrorMessage>Sorry. Cannot load</ErrorMessage>
                      </>
                    )}
                  </Bigtv>
                </>
              ) : null}
            </AnimatePresence>
            {/* On the Air*/}
            {tvOnLoading ? (
              <Loader>Loading...</Loader>
            ) : (
              <>
                <Slider>
                  <SliderTitle>
                    <ArrowBtn onClick={decreaseIndexUP}>&lt;</ArrowBtn>On the
                    Air
                    <ArrowBtn onClick={increaseIndexUP}>&gt;</ArrowBtn>
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
                      {tvOncoming?.results
                        .slice(1)
                        .slice(offset * indexUP, offset * indexUP + offset)
                        .map((tv) => (
                          <Box
                            layoutId={`${tv.id}UP`}
                            key={`${tv.id}UP`}
                            bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClickedOn(tv.id)}
                          >
                            <Info variants={infoVars}>
                              <h4>{tv.original_name}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                </Slider>
                <AnimatePresence>
                  {bigtvMatchOn ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <Bigtv
                        layoutId={bigtvMatchOn?.params.showId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedtvOn ? (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedtvOn.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedtvOn.original_name}</BigTitle>
                            <BigOverview>
                              {clickedtvOn.overview || "No overview settled"}
                            </BigOverview>
                          </>
                        ) : (
                          <>
                            <Error>404 Error &#40;</Error>
                            <ErrorMessage>Sorry. Cannot load</ErrorMessage>
                          </>
                        )}
                      </Bigtv>
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}
            {/* Top Rated*/}
            {tvTopLoading ? (
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
                      {tvTopRated?.results
                        .slice(1)
                        .slice(offset * indexTR, offset * indexTR + offset)
                        .map((tv) => (
                          <Box
                            layoutId={`${tv.id}TR`}
                            key={`${tv.id}TR`}
                            bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClickedTop(tv.id)}
                          >
                            <Info variants={infoVars}>
                              <h4>{tv.original_name}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                </Slider>
                <AnimatePresence>
                  {bigtvMatchTop ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <Bigtv
                        layoutId={bigtvMatchTop?.params.showId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedtvTop ? (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedtvTop.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedtvTop.original_name}</BigTitle>
                            <BigOverview>
                              {clickedtvTop.overview || "No overview settled"}
                            </BigOverview>
                          </>
                        ) : (
                          <>
                            <Error>404 Error &#40;</Error>
                            <ErrorMessage>Sorry. Cannot load</ErrorMessage>
                          </>
                        )}
                      </Bigtv>
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}
            {/* Popular */}
            {tvPopularLoading ? (
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
                      {tvPopular?.results
                        .slice(1)
                        .slice(offset * indexP, offset * indexP + offset)
                        .map((tv) => (
                          <Box
                            layoutId={`${tv.id}P`}
                            key={`${tv.id}P`}
                            bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClickedPop(tv.id)}
                          >
                            <Info variants={infoVars}>
                              <h4>{tv.original_name}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                </Slider>
                <AnimatePresence>
                  {bigtvMatchPop ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <Bigtv
                        layoutId={bigtvMatchPop?.params.showId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedtvPop ? (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedtvPop.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedtvPop.original_name}</BigTitle>
                            <BigOverview>
                              {clickedtvPop.overview || "No overview settled"}
                            </BigOverview>
                          </>
                        ) : (
                          <>
                            <Error>404 Error &#40;</Error>
                            <ErrorMessage>Sorry. Cannot load</ErrorMessage>
                          </>
                        )}
                      </Bigtv>
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

export default Tv;
