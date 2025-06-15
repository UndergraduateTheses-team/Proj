import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useUpdateGenre from '~/hooks/genre/useUpdateGenre';
import { UserContext } from '~/context/authContext';
import DenyAccess from '~/components/access/403';

import Footer from '~/components/footer/Footer';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';
import styled from 'styled-components';
import { FaEdit } from 'react-icons/fa';

function UpdateGenre() {
    const { allowAccess } = useContext(UserContext);
    const [genreInfo, setGenreInfo] = useState({ name: '' });
    const { id } = useParams();
    const { updateGenre } = useUpdateGenre();

    useEffect(() => {
        const getGenre = async () => {
            try {
                const response = await fetch(`/Api/api/genres/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setGenreInfo(data.datas);
                }
                console.log(data?.message);
            } catch (error) {
                console.error(error);
            }
        };
        getGenre();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!genreInfo.name.trim()) return;

        await updateGenre(genreInfo, id);
        // Optional: Add a toast or redirect
        window.location.href = '/genres';
    };

    return allowAccess ? (
        <>
            <NavbarAdmin />
            <UpdateWrapper>
                <FormCard>
                    <h1><FaEdit /> Update Genre</h1>
                    <p>Modify the name of the genre below and hit update.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={genreInfo.name}
                            onChange={(e) => setGenreInfo({ ...genreInfo, name: e.target.value })}
                            placeholder="Enter new genre name"
                            required
                        />
                        <button type="submit">Update</button>
                    </form>
                </FormCard>
            </UpdateWrapper>
            <Footer />
        </>
    ) : (
        <DenyAccess />
    );
}

export default UpdateGenre;

// Styled Components
const UpdateWrapper = styled.div`
    min-height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
    padding: 2rem;
`;

const FormCard = styled.div`
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(14px);
    border-radius: 20px;
    padding: 3rem 2rem;
    color: #fff;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    text-align: center;

    h1 {
        font-size: 2.2rem;
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    p {
        font-size: 1rem;
        margin-bottom: 2rem;
        color: #ddd;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    input {
        padding: 1rem;
        font-size: 1rem;
        border-radius: 8px;
        border: none;
        outline: none;
        transition: box-shadow 0.3s ease;
    }

    input:focus {
        box-shadow: 0 0 10px #4caf50;
    }

    button {
        background-color: #4caf50;
        color: white;
        font-weight: bold;
        border: none;
        padding: 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #43a047;
    }

    button:disabled {
        background-color: #888;
        cursor: not-allowed;
    }
`;
