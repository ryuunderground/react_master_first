import axios from "axios";

const API_KEY = "3daf370081ec1b0b80c8311506d2f2da";

const API_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZGFmMzcwMDgxZWMxYjBiODBjODMxMTUwNmQyZjJkYSIsIm5iZiI6MTcyMzc0NDI3MC41MjI2NDIsInN1YiI6IjY2YmUzZjZkOWVjOTYxZGMxZGMzOGRhYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cokcS25onPNvmDQTEQALtddISNVN54d3mipCEWX_iFM";

const BASE_URL = "https://api.themoviedb.org/3";

interface IMovie {
  backdrop_path: string;
  id: number;
  poster_path: string;
  title: string;
  overview: string;
  gernres: string;
}
interface ITv {
  backdrop_path: string;
  id: number;
  poster_path: string;
  original_name: string;
  overview: string;
}
interface ISearch {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  title: string;
  media_type: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export interface IGetMoviesReviewResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvsResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface IGetSearchResult {
  page: number;
  results: ISearch[];
  total_pages: number;
  total_results: number;
}

export const getMovies = async (lang: string, type: string, page?: number) => {
  const response = await axios.get(
    `${BASE_URL}/movie/${type}?language=${lang}&page=${
      page ?? 1
    }&api_key=${API_KEY}`
  );
  return response.data;
};
export const getTvs = async (lang: string, type: string, page?: number) => {
  const response = await axios.get(
    `${BASE_URL}/tv/${type}?language=${lang}&page=${
      page ?? 1
    }&api_key=${API_KEY}`
  );
  return response.data;
};
export const getMovieReviews = async (
  movieID: number,
  lang: string,
  page?: number
) => {
  const response = await axios.get(
    `${BASE_URL}/movie/${movieID}/reviews?language=${lang}&page=${
      page ?? 1
    }&api_key=${API_KEY}`
  );
  return response.data;
};
export const getMovieGenres = async (
  movieID: number,
  lang: string,
  page?: number
) => {
  const response = await axios.get(
    `${BASE_URL}/movie/${movieID}/keywords?language=${lang}&page=${
      page ?? 1
    }&api_key=${API_KEY}`
  );
  return response.data;
};
export const getTvGenres = async (
  seriesID: number,
  lang: string,
  page?: number
) => {
  const response = await axios.get(
    `${BASE_URL}/tv/${seriesID}/keywords?language=${lang}&page=${
      page ?? 1
    }&api_key=${API_KEY}`
  );
  console.log(response);
  return response.data;
};
export const getSearchs = async (
  lang: string,
  keyword: string,
  page?: number
) => {
  const response = await axios.get(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=${lang}&page=${
      page ?? 1
    }&query=${keyword}&include_adult=true`
  );
  return response.data;
};

export const getMovieSearchs = async (list: Array<ISearch>) => {
  const movieSearch = list.filter((search) => search.media_type === "movie");
  return movieSearch;
};
export const getTvSearchs = async (list: Array<ISearch>) => {
  const tvSearch = list.filter((search) => search.media_type === "tv");
  return tvSearch;
};
