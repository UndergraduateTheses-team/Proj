import { useEffect, useState } from 'react';

const useSearchFilm = (name) => {
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const searchFilms = async () => {
            if (!name) return;

            setLoading(true);
            setError(null);

            try {
                const response = await fetch('/Api/api/films/search-film', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name }), 
                });

                const data = await response.json();

                if (response.ok) {
                    setSearchResult(data);
                } else {
                    console.error('Search failed:', data);
                    setError(data?.error || 'Search failed');
                }
            } catch (err) {
                console.error('Network or server error:', err);
                setError('Network error');
            } finally {
                setLoading(false);
            }
        };

        searchFilms();
    }, [name]); // React to changes in `name`

    return { searchResult, loading, error };
};

export default useSearchFilm;
