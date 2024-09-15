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

const Box = styled(motion.div)<{ bgPhoto: string | null }>`
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
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 300px;
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

const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  const navigate = useNavigate();
  const bigSearchMatch = useMatch("react_master_graduate/search/:searchId");
  const { scrollY } = useScroll();
  const { data: searchResult, isLoading: searching } =
    useQuery<IGetSearchResult>(["search", "search_result"], () =>
      getSearchs("en-US", keyword || "error")
    );

  const [index, setIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const increaseIndex = () => {
    if (searchResult) {
      if (isLeaving) return;
      toggleLeaving();
      const totalSearchs = searchResult.results.length - 1;
      const maxIndex = Math.floor(totalSearchs / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    setIsLeaving((prev) => !prev);
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
          <Slider>
            <SliderTitle onClick={increaseIndex}>
              Search Result for '{keyword}'
            </SliderTitle>
            <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
              <Row
                variants={rowVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {searchResult?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((search) => (
                    <Box
                      layoutId={search.id + ""}
                      key={search.id}
                      bgPhoto={
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
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              clickedSearch.backdrop_path,
                              "w500"
                            )})`,
                          }}
                        />
                      ) : clickedSearch.poster_path ? (
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              clickedSearch.poster_path,
                              "w500"
                            )})`,
                          }}
                        />
                      ) : (
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent)
                              "w500"
                            )})`,
                          }}
                        >
                          <NoImg>No Image Contents</NoImg>
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
        </>
      )}

      <ReactQueryDevtools initialIsOpen={true} />
    </Wrapper>
  );
};

export default Search;
