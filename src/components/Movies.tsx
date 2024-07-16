import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Movie.css";

interface MovieInterfaceProps {
  title: string;
  year: number;
  summary: string;
  poster: string;
  key: number;
  genres: string[];
}

const Movie = ({
  title,
  year,
  summary,
  poster,
  key,
  genres,
}: MovieInterfaceProps) => {
  const splicedSummary = summary.slice(0, 130);
  return (
    /**
    <Link
      to={{
        pathname: "/movie-detail",
        state: {
          year,
          title,
          summary,
          poster,
          genres,
        },
      }}
    >
      <div className="movie">
        <h3 className="movie__title">{title}</h3>
        <div className="movie__contents">
          <img src={poster} className="movie__poster"></img>
          <div className="movie__info">
            <div className="movie__text">
              <h5 className="movie__year">{year}</h5>
              <ul className="movie__genres">
                {genres.map((genre, index) => (
                  <li className="movie__genre" key={index}>
                    {genre}
                  </li>
                ))}
              </ul>
            </div>
            <p className="movie__summary">{splicedSummary}...</p>
          </div>
        </div>
      </div>
    </Link>
     */
    <></>
  );
};

Movie.propTypes = {
  key: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  summary: PropTypes.string,
  poster: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Movie;
