import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useGetGenres from '~/hooks/genre/useGetGenres';
import { UserContext } from '~/context/authContext';
import DenyAccess from '~/components/access/403';
import Footer from '~/components/footer/Footer';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';

function GenresPage() {
    const { genreList } = useGetGenres();
    const { allowAccess } = useContext(UserContext);

    return (
        <StyledPage>
            <NavbarAdmin />
            <StyledContainer>
                {allowAccess ? (
                    <>
                        <HeaderBar>
                            <h1>🎬 Genre Management</h1>
                            <Link to="/createGenre" className="create-btn">
                                <FaPlus /> Add Genre
                            </Link>
                        </HeaderBar>

                        <CardGrid>
                            {genreList.map((genre) => (
                                <Card key={genre._id}>
                                    <GenreName>{genre.name}</GenreName>
                                    <Actions>
                                        <Link to={`/updateGenre/${genre._id}`} className="edit">
                                            <FaEdit /> Edit
                                        </Link>
                                        <Link to={`/deleteGenre/${genre._id}`} className="delete">
                                            <FaTrashAlt /> Delete
                                        </Link>
                                    </Actions>
                                </Card>
                            ))}
                        </CardGrid>
                    </>
                ) : (
                    <DenyAccess />
                )}
            </StyledContainer>
            <Footer />
        </StyledPage>
    );
}

export default GenresPage;

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #0b0c2a;
    color: #f5f5f5;
    font-family: 'Poppins', sans-serif;
`;

const StyledContainer = styled.div`
    flex: 1;
    padding: 4em 2em;

    .content {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }
`;

const HeaderBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2em;

    h1 {
        font-size: 2rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 0.5em;
        color: #ffffff;
    }

    .addGenreBtn {
        background-color: #4caf50;
        color: white;
        padding: 0.8em 1.5em;
        border: none;
        border-radius: 10px;
        font-weight: bold;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.5em;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #45a049;
        }
    }
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2em;
`;

const Card = styled.div`
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5em;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    color: #f0f0f0;
    text-align: center;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.08);
    }
`;

const GenreName = styled.h3`
    margin-bottom: 1em;
    font-size: 1.4rem;
    font-weight: 600;
    color: #ffffff;
`;

const Actions = styled.div`
    display: flex;
    justify-content: center;
    gap: 1em;

    a {
        padding: 0.5em 1em;
        border-radius: 8px;
        font-weight: bold;
        text-decoration: none;
        color: white;
        display: flex;
        align-items: center;
        gap: 0.5em;
        font-size: 0.9rem;

        &.edit {
            background-color: #00bcd4;
        }

        &.delete {
            background-color: #f44336;
        }

        &:hover {
            opacity: 0.85;
        }
    }
`;
