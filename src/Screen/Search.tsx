import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { IGetSearchResult, getSearchs } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { off } from "process";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  height: 600px;
  margin-top: 80px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
const Sliders = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 200px;
`;
const Slider = styled.div`
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

const Box = styled(motion.div)<{ bgphoto: string | null }>`
  background-color: white;
  height: 200px;
  font-size: 36px;
  background-image: url(${(props) => props.bgphoto});
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
  display: flex;
  justify-content: center;
  align-items: center;
`;
const NoImg = styled.span`
  font-size: 36px;
  height: 300px;
  margin: 50px;
  margin-top: 50px;
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

const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const navigate = useNavigate();
  const bigSearchMatch = useMatch("react_master_graduate/search/:searchId");
  const { scrollY } = useScroll();
  const { data: searchResult, isLoading: searching } =
    useQuery<IGetSearchResult>(["search", "search_result"], () =>
      getSearchs("en-US", keyword || "error")
    );
  const movieSearch = searchResult?.results.filter(
    (search) => search.media_type === "movie"
  );
  const tvSearch = searchResult?.results.filter(
    (search) => search.media_type === "tv"
  );
  console.log(movieSearch);
  console.log(tvSearch);
  const [indexMovie, setIndexMovie] = useState(0);
  const [indexTv, setIndexTv] = useState(0);
  const [isLeavingMovie, setIsLeavingMovie] = useState(false);
  const [isLeavingTv, setIsLeavingTv] = useState(false);

  const increaseIndexMovie = () => {
    if (movieSearch) {
      if (isLeavingMovie) return;
      toggleLeavingMovie();
      const totalMovieSearchs = movieSearch.length - 1;
      const maxIndexMovie = Math.floor(totalMovieSearchs / offset) - 1;
      setIndexMovie((prev) => (prev === maxIndexMovie ? 0 : prev + 1));
    }
  };
  const decreaseIndexMovie = () => {
    if (movieSearch) {
      if (isLeavingMovie) return;
      toggleLeavingMovie();
      const totalMovieSearchs = movieSearch.length - 1;
      const maxIndexMovie = Math.floor(totalMovieSearchs / offset) - 1;
      setIndexMovie((prev) => (prev === 0 ? maxIndexMovie : prev - 1));
    }
  };
  const increaseIndexTv = () => {
    if (tvSearch) {
      if (isLeavingTv) return;
      toggleLeavingTv();
      const totalTvSearchs = tvSearch.length - 1;
      const maxIndexTv = Math.floor(totalTvSearchs / offset);
      setIndexTv((prev) => (prev === maxIndexTv ? 0 : prev + 1));
    }
  };
  const decreaseIndexTv = () => {
    if (tvSearch) {
      if (isLeavingTv) return;
      toggleLeavingTv();
      const totalTvSearchs = tvSearch.length - 1;
      const maxIndexTv = Math.floor(totalTvSearchs / offset) - 1;
      console.log(maxIndexTv);
      setIndexTv((prev) => (prev === 0 ? maxIndexTv : prev - 1));
    }
  };

  const toggleLeavingMovie = () => {
    setIsLeavingMovie((prev) => !prev);
  };
  const toggleLeavingTv = () => {
    setIsLeavingTv((prev) => !prev);
  };

  const offset = 6;
  const onBoxClicked = (searchId: number) => {
    navigate(`/react_master_graduate/search/${searchId}`);
  };
  const onOverlayClicked = () => {
    navigate(-1);
  };

  const clickedSearch =
    bigSearchMatch?.params.searchId &&
    searchResult?.results.find(
      (search) => String(search.id) === bigSearchMatch?.params.searchId
    );

  return (
    <Wrapper>
      {searching ? (
        <Loader>Searching...</Loader>
      ) : (
        <>
          <Sliders>
            <Slider>
              {movieSearch && movieSearch.length > 6 ? (
                <SliderTitle>
                  <ArrowBtn onClick={decreaseIndexMovie}>&lt;</ArrowBtn>
                  Movie : Search Result for '{keyword}'
                  <ArrowBtn onClick={increaseIndexMovie}>&gt;</ArrowBtn>
                </SliderTitle>
              ) : (
                <SliderTitle>Movie : Search Result for '{keyword}'</SliderTitle>
              )}
              <AnimatePresence
                onExitComplete={toggleLeavingMovie}
                initial={false}
              >
                <Row
                  variants={rowVars}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={indexMovie}
                >
                  {movieSearch
                    ?.slice(offset * indexMovie, offset * indexMovie + offset)
                    .map((search) => (
                      <Box
                        layoutId={search.id + ""}
                        key={search.id}
                        bgphoto={
                          search.backdrop_path
                            ? makeImagePath(search.backdrop_path, "w500")
                            : makeImagePath(search.poster_path, "w500")
                        }
                        whileHover="hover"
                        initial="normal"
                        variants={boxVars}
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClicked(search.id)}
                      >
                        <Info variants={infoVars}>
                          <h4>{search.name || search.title || keyword}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {bigSearchMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClicked}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  ></Overlay>
                  <Bigtv
                    layoutId={bigSearchMatch?.params.searchId + ""}
                    style={{ top: scrollY.get() + 100 }}
                  >
                    {clickedSearch && (
                      <>
                        {clickedSearch.backdrop_path ? (
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, #181818, transparent), url(${makeImagePath(
                                clickedSearch.backdrop_path,
                                "w500"
                              )})`,
                            }}
                          />
                        ) : clickedSearch.poster_path ? (
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, #181818, transparent), url(${makeImagePath(
                                clickedSearch.poster_path,
                                "w500"
                              )})`,
                            }}
                          />
                        ) : (
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, #181818, transparent)
                              "w500"
                            )})`,
                            }}
                          >
                            <NoImg>No Image on Server</NoImg>
                          </BigCover>
                        )}
                        <BigTitle>
                          {clickedSearch.name || clickedSearch.title || keyword}
                        </BigTitle>
                        <BigOverview>{clickedSearch.overview}</BigOverview>
                      </>
                    )}
                  </Bigtv>
                </>
              ) : null}
            </AnimatePresence>
            {/* Tv Search */}
            <Slider>
              {tvSearch && tvSearch.length > 6 ? (
                <SliderTitle>
                  <ArrowBtn onClick={decreaseIndexTv}>&lt;</ArrowBtn>
                  Tv : Search Result for '{keyword}'
                  <ArrowBtn onClick={increaseIndexTv}>&gt;</ArrowBtn>
                </SliderTitle>
              ) : (
                <SliderTitle>Tv : Search Result for '{keyword}'</SliderTitle>
              )}
              <AnimatePresence onExitComplete={toggleLeavingTv} initial={false}>
                <Row
                  variants={rowVars}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={indexTv}
                >
                  {tvSearch
                    ?.slice(offset * indexTv, offset * indexTv + offset)
                    .map((search) => (
                      <Box
                        layoutId={search.id + ""}
                        key={search.id}
                        bgphoto={
                          search.backdrop_path
                            ? makeImagePath(search.backdrop_path, "w500")
                            : makeImagePath(search.poster_path, "w500")
                        }
                        whileHover="hover"
                        initial="normal"
                        variants={boxVars}
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClicked(search.id)}
                      >
                        <Info variants={infoVars}>
                          <h4>{search.name || search.title || keyword}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {bigSearchMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClicked}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  ></Overlay>
                  <Bigtv
                    layoutId={bigSearchMatch?.params.searchId + ""}
                    style={{ top: scrollY.get() + 100 }}
                  >
                    {clickedSearch && (
                      <>
                        {clickedSearch.backdrop_path ? (
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, #181818, transparent), url(${makeImagePath(
                                clickedSearch.backdrop_path,
                                "w500"
                              )})`,
                            }}
                          />
                        ) : clickedSearch.poster_path ? (
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, #181818, transparent), url(${makeImagePath(
                                clickedSearch.poster_path,
                                "w500"
                              )})`,
                            }}
                          />
                        ) : (
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, #181818, transparent)
                              "w500"
                            )})`,
                            }}
                          >
                            <NoImg>No Image on Server</NoImg>
                          </BigCover>
                        )}
                        <BigTitle>
                          {clickedSearch.name || clickedSearch.title || keyword}
                        </BigTitle>
                        <BigOverview>{clickedSearch.overview}</BigOverview>
                      </>
                    )}
                  </Bigtv>
                </>
              ) : null}
            </AnimatePresence>
          </Sliders>
        </>
      )}

      <ReactQueryDevtools initialIsOpen={true} />
    </Wrapper>
  );
};

export default Search;
