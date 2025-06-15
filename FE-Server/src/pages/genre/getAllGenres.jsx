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
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredGenres = genreList.filter(genre =>
        genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <CinematicContainer>
            <NavbarAdmin />
            <div className="content">
                {allowAccess ? (
                    <>
                        <h1 className="title">ANIME GENRE VAULT</h1>
                        <div className="controls">
                            <input
                                type="text"
                                placeholder="Search genres..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="searchBar"
                            />
                            <Link to="/createGenre">
                                <button className="addButton">Add New Genre</button>
                            </Link>
                        </div>
                        <GenreTable>
                            <thead>
                                <tr>
                                    <th>GENRE TITLE</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGenres.map((genre) => (
                                    <tr key={genre._id}>
                                        <td>{genre.name}</td>
                                        <td>
                                            <Link to={`/updateGenre/${genre._id}`}>
                                                <button className="editButton">Edit</button>
                                            </Link>
                                            <button
                                                className="deleteButton"
                                                onClick={() => {/* Handle delete logic */}}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </GenreTable>
                    </>
                ) : (
                    <DenyAccess />
                )}
            </div>
            <Footer />
        </CinematicContainer>
    );
}

export default GenresPage;

const CinematicContainer = styled.div`
    background: linear-gradient(to bottom, #1a1a2e, #16213e);
    min-height: 100vh;
    color: #fff;
    font-family: 'Arial', sans-serif;

    .content {
        padding: 80px 40px 40px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .title {
        text-align: center;
        font-size: 2rem;
        color: #ff4040;
        text-transform: uppercase;
        margin-bottom: 20px;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .searchBar {
        padding: 10px;
        width: 300px;
        border: none;
        border-radius: 5px;
        background-color: #2a2a3a;
        color: #fff;
        font-size: 1rem;
    }

    .addButton {
        background-color: #ff5555;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s;

        &:hover {
            background-color: #e60000;
        }
    }

    a {
        text-decoration: none;
    }
`;

const GenreTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: #1e1e2f;

    th, td {
        padding: 15px;
        text-align: left;
    }

    th {
        background-color: #ff4040;
        color: white;
        text-transform: uppercase;
    }

    td {
        background-color: #2a2a3a;
        border-bottom: 1px solid #3a3a4a;
    }

    tr:hover td {
        background-color: #3a3a4a;
    }

    .editButton {
        background-color: #4caf50;
        color: white;
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
        transition: background-color 0.3s;

        &:hover {
            background-color: #45a049;
        }
    }

    .deleteButton {
        background-color: #f44336;
        color: white;
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #da190b;
        }
    }
`;