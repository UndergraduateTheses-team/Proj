import { useParams } from 'react-router-dom';
import useCreateEpisode from '~/hooks/episode/useCreateEpisode';
import DenyAccess from '~/components/access/403';
import styled from 'styled-components';
import Footer from '~/components/footer/Footer';
import { useState, useContext } from 'react';
import { UserContext } from '~/context/authContext';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';

function CreateEpisode() {
    const { allowAccess } = useContext(UserContext);
    const { id } = useParams();

    const [episodeInfo, setEpisodeInfo] = useState({
        movieId: id,
        name_episode: '',
        episode_number: 1,
        videoUrl: 'no need!',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const { createEpisode } = useCreateEpisode();
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createEpisode(episodeInfo, selectedFile);
    };

    return (
        <StyleEpisode>
            {allowAccess === true ? (
                <>
                    <NavbarAdmin />
                    <div className="formContainer">
                        <form onSubmit={handleSubmit}>
                            {selectedFile && <video src={URL.createObjectURL(selectedFile)} controls></video>}
                            <label>Episode Name</label>
                            <input
                                type="text"
                                onChange={(e) => {
                                    setEpisodeInfo({ ...episodeInfo, name_episode: e.target.value });
                                }}
                            ></input>
                            <label>Episode Number</label>
                            <input
                                type="number"
                                min={1}
                                onChange={(e) => {
                                    setEpisodeInfo({ ...episodeInfo, episode_number: e.target.value });
                                }}
                            ></input>
                            <input type="file" accept="video/*" onChange={handleFileChange} />
                            <div className="buttonContainer">
                                <button type="submit">Upload</button>
                                <button type="button">Back</button>
                            </div>
                        </form>
                    </div>
                    <Footer />
                </>
            ) : (
                <DenyAccess />
            )}
        </StyleEpisode>
    );
}

export default CreateEpisode;

const StyleEpisode = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #0b0c2a;

    .formContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        padding: 2em 0;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1em;
        padding: 2em;
        border: 1px solid #ccc;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
    }

    label {
        font-weight: bold;
        margin-bottom: 0.5em;
    }

    input[type='text'],
    input[type='number'],
    input[type='file'] {
        padding: 0.5em;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 100%;
    }

    video {
        width: 100%;
        max-height: 300px;
        margin-bottom: 1em;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .buttonContainer {
        display: flex;
        justify-content: space-between;
        gap: 1em;
    }

    button {
        padding: 0.5em 1em;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        flex-grow: 1;
    }

    button[type='submit'] {
        background-color: #4caf50; /* Green */
        color: white;
    }

    button[type='button'] {
        background-color: #f44336; /* Red */
        color: white;
    }
`;
