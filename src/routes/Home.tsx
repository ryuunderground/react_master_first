import React from "react";
import axios from "axios";
import Movie from "../components/Movies";
import "./Home.scss";

interface HomeInterfaceProps {
  title: string;
  year: number;
  summary: string;
  poster: string;
  key: number;
  genres: string[];
}

const Home = () => {
  return <></>;
};
/**
class Home extends React.Component {
  state = {
    isLoading: true,
    movies: [],
  };
  getMovies = async () => {
    const {
      data: {
        data: { movies },
      },
    } = await axios.get(
      "https://yts-proxy.nomadcoders1.now.sh/list_movies.json?sort_by=rating"
    );
    this.setState({ movies, isLoading: false });
    console.log(movies);
  };
  componentDidMount() {
    this.getMovies();
  }

  render() {
    const { isLoading, movies } = this.state;
    return (
      
      <section className="container">
        {isLoading ? (
          <h1 className="Loading">Loading...</h1>
        ) : (
          <div className="movies">
            {movies.map((movie) => (
              <Movie
                id={movie.id}
                year={movie.year}
                title={movie.title}
                summary={movie.summary}
                poster={movie.medium_cover_image}
                key={movie.id}
                genres={movie.genres}
              />
            ))}
          </div>
        )}
      </section> 
      <></>
    );
  }
}

*/

export default Home;
