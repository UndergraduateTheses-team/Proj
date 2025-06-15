import React, { useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import useGetAllFilm from '~/hooks/film/useGetAllFilm';
import styled from 'styled-components';
import ConfirmDialog from './confirmDialog';
import useDeleteFilm from '~/hooks/film/useDeleteFilm';
import { UserContext } from '~/context/authContext';
import Footer from '~/components/footer/Footer';
import DenyAccess from '~/components/access/403';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';

function FilmInforPage() {
    const { id } = useParams();
    const { allowAccess } = useContext(UserContext);
    const { filmList } = useGetAllFilm();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { deleteFilm } = useDeleteFilm(id);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id) => {
        setSelectedId(id);
        setShowConfirmDialog(true);
    };

    const confirmDelete = async () => {
        await deleteFilm(selectedId);
        setShowConfirmDialog(false);
        window.location.reload(); // Temporary refresh
    };

    const cancelDelete = () => {
        setShowConfirmDialog(false);
    };

    const filteredFilms = filmList.filter(film =>
        film.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <CinematicContainer>
            {allowAccess ? (
                <>
                    <NavbarAdmin />
                    <div className="content">
                        <h1 className="title">Anime Film Vault</h1>
                        <div className="controls">
                            <input
                                type="text"
                                placeholder="Search films..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="searchBar"
                            />
                            <Link to="/filmCreate">
                                <button className="addButton">Add New Film</button>
                            </Link>
                        </div>
                        <FilmTable>
                            <thead>
                                <tr>
                                    <th>FILM TITLE</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFilms.map((filmInfo) => (
                                    <tr key={filmInfo._id}>
                                        <td>{filmInfo.name}</td>
                                        <td>
                                            <Link to={`/film/edit/${filmInfo._id}`}>
                                                <button className="editButton">Edit</button>
                                            </Link>
                                            <button
                                                className="deleteButton"
                                                onClick={() => handleDelete(filmInfo._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </FilmTable>
                    </div>
                    <Footer />
                </>
            ) : (
                <DenyAccess />
            )}
            {showConfirmDialog && (
                <ConfirmDialog
                    message="Are you sure you want to delete this film?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </CinematicContainer>
    );
}

export default FilmInforPage;

const CinematicContainer = styled.div`
    background: linear-gradient(to bottom, #1a1a2e, #16213e);
    min-height: 100vh;
    color: #fff;
    font-family: 'Arial', sans-serif;

    .content {
        padding: 80px 40px 40px; /* Increased top padding to 80px to avoid overlap with Navbar */
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

const FilmTable = styled.table`
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