import { useEffect, useState } from 'react';

const useGetGenres = () => {
    const [genreList, setGenreList] = useState([]);

    useEffect(() => {
        const getGenres = async () => {
            const response = await fetch('/Api/api/genres/');
            const data = await response.json();
            if (!response.ok) {
                console.log(data.error);
                return;
            }
            setGenreList(data.datas);
        };
        getGenres();
    }, []);

    return { genreList };
};

export default useGetGenres;
