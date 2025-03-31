import React, { useEffect, useState, useContext } from 'react';
import useCreateFilm from '~/hooks/film/useCreateFilm';
import Footer from '~/components/footer/Footer';
import styled from 'styled-components';
import DenyAccess from '~/components/access/403';
import { UserContext } from '~/context/authContext';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';

function CreateFilmPage() {
    const { allowAccess } = useContext(UserContext);
    const [filmInfor, setFilmInfor] = useState({
        name: '',
        genres: [],
        country: '',
        actors: [],
        director: '',
        status: 'dang cap nhat',
        poster_img: null,
        releaseDate: '',
        description: '',
        totalChap: '',
        movieDuration: '',
    });
    console.log(filmInfor);

    const [genresList, setGenresList] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const { createFilm } = useCreateFilm();

    useEffect(() => {
        const getGenreList = async () => {
            const response = await fetch('/Api/api/genres/');
            const data = await response.json();
            if (response.ok) {
                setGenresList(data.datas);
            } else {
                console.log(response.message);
            }
        };
        getGenreList();
    }, []);

    const handleChange = (genreId) => {
        const isChecked = selectedGenres.includes(genreId);
        if (isChecked) {
            setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
        } else {
            setSelectedGenres([...selectedGenres, genreId]);
        }
    };
    console.log(selectedGenres)
    const handleSubmit = async (e) => {
        e.preventDefault();
        await createFilm({ ...filmInfor, genres: selectedGenres });
        window.location.href = '/filmsInfor';
    };

    return (
        <CreateFilm>
            {allowAccess === true ? (
                <>
                    <NavbarAdmin />
                    <div className="container">
                        <div className="createFilmContairner">
                            <form className="formCreateFilm" onSubmit={handleSubmit}>
                                <label>Film name</label>
                                <input
                                    value={filmInfor.name}
                                    type="text"
                                    name="name"
                                    onChange={(e) => {
                                        setFilmInfor({ ...filmInfor, name: e.target.value });
                                    }}
                                />
                                <label>Genres</label>
                                <div className="genresContainer">
                                    {genresList.map((genre) => {
                                        return (
                                            <div
                                                key={genre._id}
                                                style={{ display: 'flex', justifyContent: 'space-between' }}
                                            >
                                                <label>{genre.name}</label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGenres.includes(genre._id)}
                                                    onChange={() => handleChange(genre._id)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <label>Film country</label>
                                <input
                                    value={filmInfor.country}
                                    type="text"
                                    name="country"
                                    onChange={(e) => {
                                        setFilmInfor({ ...filmInfor, country: e.target.value });
                                    }}
                                />
                                <label>Film actor</label>
                                <input
                                    value={filmInfor.actors}
                                    type="text"
                                    name="actor"
                                    onChange={(e) => {
                                        setFilmInfor({ ...filmInfor, actors: [e.target.value] });
                                    }}
                                />
                                <label>Film director</label>
                                <input
                                    value={filmInfor.director}
                                    type="text"
                                    name="director"
                                    onChange={(e) => {
                                        setFilmInfor({ ...filmInfor, director: e.target.value });
                                    }}
                                />

                                <label>Film status</label>
                                <select
                                    onChange={(e) => {
                                        setFilmInfor({ ...filmInfor, status: e.target.value });
                                    }}
                                >
                                    <option value="dang cap nhat">Đang cập nhật</option>
                                    <option value="hoan thanh">Đã hoàn thành</option>
                                </select>

                                <label>Film Poster</label>
                                <input
                                    type="file"
                                    name="posterImg"
                                    onChange={(e) => {
                                        setFilmInfor({ ...filmInfor, poster_img: e.target.files[0] });
                                    }}
                                />
                                <label>Film description</label>
                                <input
                                    value={filmInfor.description}
                                    type="text"
                                    name="description"
                                    onChange={(e) => {
                                        setFilmInfor({ ...filmInfor, description: e.target.value });
                                    }}
                                />
                                <label>Film totalChap</label>
                                <input
                                    value={filmInfor.totalChap}
                                    type="text"
                                    name="totalChap"
                                    onChange={(e) => {
                                        setFilmInfor({ ...filmInfor, totalChap: e.target.value });
                                    }}
                                />
                                <label>Film movieDuration</label>
                                <input
                                    value={filmInfor.movieDuration}
                                    type="text"
                                    name="movieDuration"
                                    onChange={(e) => {
                                        setFilmInfor({ ...filmInfor, movieDuration: e.target.value });
                                    }}
                                />

                                <button type="submit">Create</button>
                                <button>
                                    {' '}
                                    <a href="/filmsInfor">Back</a>
                                </button>
                            </form>
                        </div>
                    </div>
                    <Footer />
                </>
            ) : (
                <DenyAccess />
            )}
        </CreateFilm>
    );
}

export default CreateFilmPage;

const CreateFilm = styled.div`
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 400px;
        padding-top: 100px;
        padding-bottom: 100px;
    }
    .createFilmContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh; /* Center vertically */
        background-color: #f9f9f9; /* Optional: Add a background color */
    }
    .create {
        padding: 0.5rem 10rem;
    }

    .formCreateFilm {
        display: flex;
        flex-direction: column;
        gap: 1em; /* Add space between elements */
        padding: 2em;
        border: 1px solid #ccc;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Optional: Add some shadow for better visibility */
        width: 40vw; /* Optional: Set a width for the form */
    }

    .formCreateFilm label {
        display: flex;
        justify-content: center;
        font-weight: bold;
        margin-bottom: 0.5em; /* Space between label and input */
    }

    .formCreateFilm input[type='text'],
    .formCreateFilm input[type='file'],
    .formCreateFilm select {
        width: 100%;
        padding: 0.5em;
        margin-bottom: 1em; /* Space below inputs */
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .genresContainer {
        display: flex;
        justify-content: center;
        gap: 0.5em;
        margin-bottom: 1em; /* Space below genres */
    }

    .genresContainer label {
        display: flex;
        align-items: center;
    }

    .genresContainer input[type='checkbox'] {
        margin-right: 0.5em;
        margin-bottom: 0.4em;
    }

    .formCreateFilm button {
        padding: 0.5em 1em;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .formCreateFilm button[type='submit'] {
        background-color: #4caf50; /* Green */
        color: white;
    }

    .formCreateFilm button:nth-of-type(2) {
        background-color: #f44336; /* Red */
        color: white;
        margin-left: 0.5em; /* Space between buttons */
    }

    .buttonContainer {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
`;
