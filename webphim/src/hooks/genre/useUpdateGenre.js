const useUpdateGenre = () => {
    const updateGenre = async (genre, genreId) => {
        const response = await fetch(`/api/genres/${genreId}`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: genre.name }),
        });
        const data = response.json();
        if (response.ok) {
            window.location.href = '/genres';
        }
        console.log(data?.message);
    };
    return { updateGenre };
};

export default useUpdateGenre;
