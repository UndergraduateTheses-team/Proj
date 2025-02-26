function useCreateEpisode() {
    const createEpisode = async (episode, file) => {
        try {
            const formData = new FormData();
            formData.append('info', JSON.stringify(episode));
            formData.append('video', file);
            const response = await fetch(`/Api/api/episode/${episode.movieId}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                window.confirm(data?.message);
                window.location.href = "/filmsInfor/"
            }
            window.confirm(data?.message);
        } catch (error) { }
    };
    return { createEpisode };
}

export default useCreateEpisode;
