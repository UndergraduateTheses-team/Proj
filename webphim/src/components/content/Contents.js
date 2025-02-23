import React from 'react';
import MoviesRow from './MoviesRow';
import useGetGenres from '~/hooks/genre/useGetGenres';
import useGetAllFilm from '~/hooks/film/useGetAllFilm';

function Content() {
    const { genreList } = useGetGenres();
    const { filmList } = useGetAllFilm();

    const filterFilmByGenre = (genreId) => {
        return filmList.filter((film) => film.genres.includes(genreId));
    };

    return (
        <div>
            {genreList.map((genre) => (
                <MoviesRow key={genre._id} movies={filterFilmByGenre(genre._id)} title={genre.name} />
            ))}

        </div>
    );
}

export default Content;
