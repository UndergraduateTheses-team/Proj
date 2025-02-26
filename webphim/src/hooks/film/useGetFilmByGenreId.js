import { useEffect, useState } from 'react';

const useGetFilmByGenreId = (id) => {
    const [listFilms, setListFilm] = useState([]);
    const [genreName, setGenreName] = useState('')

    useEffect(() => {
        const getFilms = async () => {
            const response = await fetch('/Api/api/films/get-film-by-genre', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ genreId: id }),
            })

            const data = await response.json();
            if (response.ok) {
                setListFilm(data.filmList);
                setGenreName(data.genreName)
            }

        };
        getFilms();
    }, []);
    return { listFilms, genreName };
};

export default useGetFilmByGenreId;