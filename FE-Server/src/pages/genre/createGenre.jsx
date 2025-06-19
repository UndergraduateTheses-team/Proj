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
        if (genre.trim()) {
            await createGenre(genre.trim());
            window.location.href = '/genres';
        }
    };

    return (
        <CinematicContainer>
            <NavbarAdmin />
            <ContentArea>
                {allowAccess ? (
                    <>
                        <CreationCard>
                            <h1>Create New Genre</h1>
                            <Description>Enter the name of the new genre to add.</Description>
                            <GenreForm onSubmit={handleSubmit}>
                                <GenreInput
                                    type="text"
                                    placeholder="Enter genre name..."
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    required
                                />
                                <SubmitButton type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Add Genre'}
                                </SubmitButton>
                            </GenreForm>
                        </CreationCard>
                    </>
                ) : (
                    <DenyAccess />
                )}
            </ContentArea>
            <Footer />
        </CinematicContainer>
    );
}

export default CreateGenre;

const CinematicContainer = styled.div`
    background: linear-gradient(to bottom, #1a1a2e, #16213e);
    min-height: 100vh;
    color: #fff;
    font-family: 'Arial', sans-serif;
`;

const ContentArea = styled.div`
    padding: 80px 40px;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 160px);
`;

const CreationCard = styled.div`
    background-color: #2a2a3a;
    padding: 2rem 3rem;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    text-align: center;
    width: 100%;
    max-width: 450px;

    h1 {
        color: #ff4040;
        font-size: 2rem;
        margin-bottom: 1rem;
    }
`;

const Description = styled.p`
    color: #ccc;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
`;

const GenreForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const GenreInput = styled.input`
    padding: 0.75rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    background-color: #3a3a4a;
    color: #fff;
    outline: none;

    &:focus {
        background-color: #44445a;
    }
`;

const SubmitButton = styled.button`
    background-color: #ff5555;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #e60000;
    }

    &:disabled {
        background-color: #8a8a8a;
        cursor: not-allowed;
    }
`;