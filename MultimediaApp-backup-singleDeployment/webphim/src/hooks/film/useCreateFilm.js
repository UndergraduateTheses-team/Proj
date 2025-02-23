
const useCreateFilm = () => {
    const createFilm = async (filmInfor) => {
        try {
            const formData = new FormData();
            formData.append('poster', filmInfor.poster_img);
            formData.append('film', JSON.stringify(filmInfor));
            const response = await fetch('/api/films/create/', {
                method: 'POST',
                credentials: "include",
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) {
                console.log(data?.message);
            }
            console.log(data?.message);
        } catch (error) {
            console.log(error);
        }
    };
    return { createFilm };
};

export default useCreateFilm;
