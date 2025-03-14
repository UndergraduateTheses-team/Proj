import { useState, useEffect } from 'react';

const useGetEpisodeOfFilm = (movieId) => {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisode, setCurrentEpisode] = useState(null);

    useEffect(() => {
        const getEpisodeInfor = async () => {
            const response = await fetch(`/Api/api/episode/${movieId}`);
            const data = await response.json();
            if (response.ok) {
                setEpisodeList(data.data);
                console.log(data.data);
                setCurrentEpisode(data.data[0]);
            } else {
                console.log(data.message);
            }
        };
        getEpisodeInfor();
    }, []);

    return { episodeList, currentEpisode, setCurrentEpisode };
};

export default useGetEpisodeOfFilm;
