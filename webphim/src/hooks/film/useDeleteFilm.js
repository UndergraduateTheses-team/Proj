const useDeleteFilm = () => {
    const deleteFilm = async (movieId) => {
        try {
            const response = await fetch(`/Api/api/films/${movieId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                window.open('/filmsInfor', '_self');
            }
            console.log(data?.message);
        } catch (error) {
            console.log(error);
        }
    };

    return { deleteFilm };
};

export default useDeleteFilm;
