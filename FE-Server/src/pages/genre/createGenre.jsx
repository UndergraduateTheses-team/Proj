import React, { useState, useContext } from 'react';
import useCreateGenres from '~/hooks/genre/useCreateGenres';
import { UserContext } from '~/context/authContext';
import styled from 'styled-components';

import Footer from '~/components/footer/Footer';
import DenyAccess from '~/components/access/403';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';
import { FaPlus } from 'react-icons/fa';

function CreateGenre() {
    const [genre, setGenre] = useState('');
    const { loading, createGenre } = useCreateGenres();
    const { allowAccess } = useContext(UserContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (genre.trim()) {
            await createGenre(genre.trim());
            window.location.href = '/genres';
        }
    };

    return (
        <GenresWrapper>
            {allowAccess ? (
                <>
                    <NavbarAdmin />
                    <FormSection>
                        <Card>
                            <h1>Create New Genre</h1>
                            <p>Fill in the name of the new genre you want to add.</p>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Enter genre name..."
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    required
                                />
                                <button type="submit" disabled={loading}>
                                    <FaPlus /> {loading ? 'Creating...' : 'Create Genre'}
                                </button>
                            </form>
                        </Card>
                    </FormSection>
                    <Footer />
                </>
            ) : (
                <DenyAccess />
            )}
        </GenresWrapper>
    );
}

export default CreateGenre;

// Styled Components
const GenresWrapper = styled.div`
    min-height: 100vh;
    background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
    color: white;
`;

const FormSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rem 1rem;
`;

const Card = styled.div`
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    padding: 3rem 2rem;
    border-radius: 20px;
    max-width: 500px;
    width: 100%;
    text-align: center;
    color: white;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);

    h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    p {
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    input {
        padding: 1rem;
        border-radius: 8px;
        border: none;
        font-size: 1rem;
        outline: none;
        transition: 0.3s ease;
    }

    input:focus {
        box-shadow: 0 0 10px #4caf50;
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        background-color: #4caf50;
        padding: 1rem;
        font-size: 1rem;
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    button:hover {
        background-color: #45a049;
    }

    button:disabled {
        background-color: #999;
        cursor: not-allowed;
    }
`;
