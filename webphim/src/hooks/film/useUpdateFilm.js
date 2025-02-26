const useUpdateFilm = (id) => {
    const updateFilm = async (filmInfor) => {
        try {
            const formData = new FormData();
            formData.append('poster', filmInfor.poster_img);
            formData.append('film', JSON.stringify(filmInfor));
            const response = await fetch(`/Api/api/films/update/${id}`, {
                method: 'POST',
                body: formData,
            });
            console.log(filmInfor);
            const data = await response.json();
            if (!response.ok) {
                console.log(data?.message);
            } else {
                console.log(data?.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return { updateFilm };
};

export default useUpdateFilm;
