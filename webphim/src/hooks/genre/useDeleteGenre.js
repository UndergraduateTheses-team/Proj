const useDeleteGenre = () => {
    const deleteGenre = async (genreId) => {
        try {
            const response = await fetch(`/Api/api/genres/${genreId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                window.open('/genres', '_self');
            }
            console.log(data?.message);
        } catch (error) {
            console.log(error);
        }
    };

    return { deleteGenre };
};

export default useDeleteGenre;
