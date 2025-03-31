import React, { useState, useContext } from 'react';
import useCreateGenres from '~/hooks/genre/useCreateGenres';
import { UserContext } from '~/context/authContext';
import styled from 'styled-components';

import Footer from '~/components/footer/Footer';
import DenyAccess from '~/components/access/403';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';

function CreateGenre() {
    const [genre, setGenre] = useState('');
    const { loading, createGenre } = useCreateGenres();
    const { allowAccess } = useContext(UserContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await createGenre(genre);
        window.location.href = '/genres';
    };

    return (
        <GenresContainer>
            {allowAccess ? (
                <>
                    {loading && <span>Đang thêm dữ liệu...</span>}
                    <NavbarAdmin />
                    <div className="container">
                        <div className="createGenreContainer">
                            <h1 className="createGenreTitle">Create Genre</h1>
                            <form className="formCreateGenre" onSubmit={handleSubmit}>
                                <label>Genres Name</label>
                                <input type="text" onChange={(event) => setGenre(event.target.value)} value={genre} />
                                <button type="submit">Create</button>
                            </form>
                        </div>
                    </div>
                    <Footer />
                </>
            ) : (
                <DenyAccess />
            )}
        </GenresContainer>
    );
}

export default CreateGenre;

const GenresContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    align-items: center;
    background-color: #0b0c2a;

    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
    }

    .createGenreContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        padding: 2em;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 40vw;
    }

    .createGenreTitle {
        margin-bottom: 50px;
        color: black;
    }

    .formCreateGenre {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 1em;
    }

    .formCreateGenre label {
        display: flex;
        justify-content: center;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 0.5em;
    }

    .formCreateGenre input[type='text'] {
        width: 100%;
        padding: 1.5em;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .formCreateGenre button {
        padding: 1.5em 0em;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: #4caf50;
        color: white;
    }
`;
