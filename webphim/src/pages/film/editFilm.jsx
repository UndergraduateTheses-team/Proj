import React, { useEffect, useState } from 'react';
import Footer from '~/components/footer/Footer';
import DenyAccess from '~/components/access/403';
import useUpdateFilm from '~/hooks/film/useUpdateFilm';
import { Link, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '~/context/authContext';
import styled from 'styled-components';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';

function EditFilmPage() {
    const { id } = useParams();
    const { allowAccess } = useContext(UserContext);
    const [filmInfor, setFilmInfor] = useState({
        name: '',
        genres: [],
        country: '',
        actors: [],
        director: '',
        status: '',
        poster_img: '',
        releaseDate: '',
        description: '',
        totalChap: '',
        movieDuration: '',
    });
    const statusList = ['hoan thanh', 'dang cap nhat'];
    console.log(filmInfor);
    const [genresList, setGenresList] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const { updateFilm } = useUpdateFilm(id);

    useEffect(() => {
        const getGenreList = async () => {
            const response = await fetch('/api/genres/',{
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                setGenresList(data.datas);
            } else {
                console.log(response.message);
            }
        };

        const getFilm = async () => {
            const response = await fetch(`/api/films/get/${id}`,{
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                setFilmInfor(data.datas);
                setSelectedGenres(data.datas.genres);
            } else {
                console.log(data.message);
            }
        };
        getGenreList();
        getFilm();
    }, []);
  

    const handleChange = (genreId) => {
        const isChecked = selectedGenres.includes(genreId);
        if (isChecked) {
            setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
        } else {
            setSelectedGenres([...selectedGenres, genreId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateFilm({ ...filmInfor, genres: selectedGenres });
    };

    return (
        <CreateFilm>
            {allowAccess === true ? (
                <div>
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
                                <label> Genres</label>
                                <div className="genresContainer">
                                    {genresList.map((genre) => (
                                        <div key={genre._id}>
                                            <label>{genre.name}</label>
                                            <input
                                                type="checkbox"
                                                value={genre._id}
                                                checked={selectedGenres.includes(genre._id)}
                                                onChange={() => {
                                                    handleChange(genre._id);
                                                }}
                                            />
                                        </div>
                                    ))}
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
                                    value={filmInfor.status} // Set the initial value based on filmInfor
                                    onChange={(e) => {
                                        setFilmInfor({ ...filmInfor, status: e.target.value });
                                    }}
                                >
                                    {statusList.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <label>Film Poster</label>
                                <img src={filmInfor.poster_img} />
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

                                <Link to={`/film/createEpisode/${filmInfor?._id}`}> Create New Episode</Link>

                                <button
                                    type="submit"
                                    onClick={() => {
                                        window.location.href = '/filmsInfor';
                                    }}
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => {
                                        window.location.href = '/filmsInfor';
                                    }}
                                >
                                    Back
                                </button>
                            </form>
                        </div>
                    </div>
                    <Footer />
                </div>
            ) : (
                <DenyAccess />
            )}
        </CreateFilm>
    );
}

export default EditFilmPage;
const CreateFilm = styled.div`
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .createFilmContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh; /* Center vertically */
        background-color: #f9f9f9; /* Optional: Add a background color */
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
        margin-top: 5rem;
        margin-left: 50%;
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
