function useCreateEpisode() {
    const createEpisode = async (episode, file) => {
        async function fetchWithTimeout(url, options, timeout) {
            // Create a timeout promise that rejects after a specified time
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Request timed out')), timeout)
            );
          
            // Use Promise.race to race between the fetch request and the timeout
            return Promise.race([
              fetch(url, options),    // The actual fetch request
              timeoutPromise          // The timeout promise
            ]);
          }
        try {
            const formData = new FormData();
            formData.append('info', JSON.stringify(episode));
            formData.append('video', file);


            const response = await fetchWithTimeout(`/Api/api/episode/${episode.movieId}`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            },10000000
			);


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
