import { useEffect, useState } from 'react';

const useGetFavoriteFilm = () => {
    const [listFilms, setListFilm] = useState([]);

    useEffect(() => {
        const getListFilm = async () => {
            const response = await fetch('/api/films/list-favorite',{
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                setListFilm(data);
            }
        };
        getListFilm();
    }, []);
    return { listFilms };
};

export default useGetFavoriteFilm;
