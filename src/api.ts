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

export const getMovies = async (lang: string, page?: number) => {
  const response = await axios.get(
    `${BASE_URL}/movie/now_playing?language=${lang}&page=${
      page ?? 1
    }&api_key=${API_KEY}`
  );
  console.log(response);
  return response.data;
};
