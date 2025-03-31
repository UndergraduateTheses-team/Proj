import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useGetGenres from '~/hooks/genre/useGetGenres';
import { UserContext } from '~/context/authContext';
import DenyAccess from '~/components/access/403';

import Footer from '~/components/footer/Footer';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';

function GenresPage() {
    const { genreList } = useGetGenres();
    const { allowAccess } = useContext(UserContext);
    return (
        <StyledPage>
            <NavbarAdmin />
            <StyledContainer>
                {allowAccess === true ? (
                    <div className="content">
                        <div className="buttonContainer">
                            <Link to="/createGenre">
                                <button className="createButton">Create New</button>
                            </Link>
                        </div>
                        <table className="tableGenres">
                            <thead>
                                <tr>
                                    <th>Genres Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {genreList.map((genre) => (
                                    <tr key={genre._id}>
                                        <td>{genre.name}</td>
                                        <td>
                                            <Link className="editGenres" to={`/updateGenre/${genre._id}`}>
                                                Edit
                                            </Link>
                                            <Link className="deleteGenres" to={`/deleteGenre/${genre._id}`}>
                                                Delete
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
`;

const StyledContainer = styled.div`
    flex: 1; /* Ensures this container takes up all available space */
    display: flex;
    justify-content: center;
    align-items: center;
    margin:6em;

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80%;
        max-width: 800px;
        padding: 2em;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .buttonContainer {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 1em;
    }

    .createButton {
        padding: 0.5em 1em;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        width: 100%;

        &:hover {
            background-color: #45a049;
        }
    }

    .tableGenres {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;

        th,
        td {
            padding: 1em;
            border: 1px solid #ddd;
            text-align: left;
            background-color: white;
            
        }

        th {
            background-color: #4caf50;;
            color:white;
            
        }

        td {
            color: black;
            a {
                margin-right: 1em;
               
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
        .editGenres{
            background-color:#4caf50;
            padding:10px;
            border-radius: 10px;
        }

        .deleteGenres{
        background-color:#ff2616;
        
        padding:10px;
        border-radius: 10px;
        }

    .buttonContainer {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1em;

        a {
            width: 100%;
        }
    }

    .createButton {
        padding: 0.5em 1em;
        background-color: #4caf50; /* Green */
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        width: calc(100% - 2px); /* Adjust width to match table */
        padding: 20px;
        padding-bottom: -20px
        &:hover {
            background-color: #45a049;
        }
    }
`;
