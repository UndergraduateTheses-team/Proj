import { useEffect, useState } from 'react';

const useGetFavoriteFilm = () => {
    const [listFilms, setListFilm] = useState([]);

    useEffect(() => {
        const getListFilm = async () => {
            const response = await fetch('/Api/api/films/list-favorite',{
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
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
