import { useState } from 'react';

const useCreateGenres = () => {
    const [loading, setLoading] = useState(false);

    const createGenre = async (name) => {
        try {
            setLoading(true);
            const response = await fetch('/api/genres/', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            const data = await response.json();
            if (!response.ok) {
                console.log(data?.message);
            }
            console.log(data?.message);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    return { loading, createGenre };
};

export default useCreateGenres;
