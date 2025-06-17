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
    const [genresList, setGenresList] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [posterPreview, setPosterPreview] = useState(null); // State for image preview
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFilmInfor({ ...filmInfor, poster_img: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPosterPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createFilm({ ...filmInfor, genres: selectedGenres });
        window.location.href = '/filmsInfor';
    };

    return (
        <CinematicContainer>
            <NavbarAdmin />
            <ContentArea>
                {allowAccess ? (
                    <>
                        <FilmCreationCard>
                            <h1>Create New Film</h1>
                            <FilmForm onSubmit={handleSubmit}>
                                <FormGroup>
                                    <label>Film Name</label>
                                    <InputField
                                        type="text"
                                        value={filmInfor.name}
                                        onChange={(e) => setFilmInfor({ ...filmInfor, name: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Genres</label>
                                    <GenresContainer>
                                        {genresList.map((genre) => (
                                            <GenreCheckbox key={genre._id}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGenres.includes(genre._id)}
                                                    onChange={() => handleChange(genre._id)}
                                                />
                                                <span>{genre.name}</span>
                                            </GenreCheckbox>
                                        ))}
                                    </GenresContainer>
                                </FormGroup>
                                <FormGroup>
                                    <label>Film Country</label>
                                    <InputField
                                        type="text"
                                        value={filmInfor.country}
                                        onChange={(e) => setFilmInfor({ ...filmInfor, country: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Film Actor</label>
                                    <InputField
                                        type="text"
                                        value={filmInfor.actors}
                                        onChange={(e) => setFilmInfor({ ...filmInfor, actors: [e.target.value] })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Film Director</label>
                                    <InputField
                                        type="text"
                                        value={filmInfor.director}
                                        onChange={(e) => setFilmInfor({ ...filmInfor, director: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Film Status</label>
                                    <SelectField
                                        value={filmInfor.status}
                                        onChange={(e) => setFilmInfor({ ...filmInfor, status: e.target.value })}
                                    >
                                        <option value="dang cap nhat">Đang cập nhật</option>
                                        <option value="hoan thanh">Đã hoàn thành</option>
                                    </SelectField>
                                </FormGroup>
                                <FormGroup>
                                    <label>Film Poster</label>
                                    <FileInput
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    {posterPreview && (
                                        <PosterPreview src={posterPreview} alt="Poster Preview" />
                                    )}
                                </FormGroup>
                                <FormGroup>
                                    <label>Film Description</label>
                                    <InputField
                                        type="text"
                                        value={filmInfor.description}
                                        onChange={(e) => setFilmInfor({ ...filmInfor, description: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Total Chapters</label>
                                    <InputField
                                        type="text"
                                        value={filmInfor.totalChap}
                                        onChange={(e) => setFilmInfor({ ...filmInfor, totalChap: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label>Movie Duration</label>
                                    <InputField
                                        type="text"
                                        value={filmInfor.movieDuration}
                                        onChange={(e) => setFilmInfor({ ...filmInfor, movieDuration: e.target.value })}
                                    />
                                </FormGroup>
                                <ButtonGroup>
                                    <SubmitButton type="submit">Create</SubmitButton>
                                    <BackButton>
                                        <a href="/filmsInfor">Back</a>
                                    </BackButton>
                                </ButtonGroup>
                            </FilmForm>
                        </FilmCreationCard>
                    </>
                ) : (
                    <DenyAccess />
                )}
            </ContentArea>
            <Footer />
        </CinematicContainer>
    );
}

export default CreateFilmPage;

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
`;

const FilmCreationCard = styled.div`
    background-color: #2a2a3a;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    text-align: center;

    h1 {
        color: #ff4040;
        font-size: 2rem;
        margin-bottom: 1.5rem;
    }
`;

const FilmForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const FormGroup = styled.div`
    text-align: left;

    label {
        display: block;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: #ccc;
    }
`;

const InputField = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 5px;
    background-color: #3a3a4a;
    color: #fff;
    font-size: 1rem;
    outline: none;

    &:focus {
        background-color: #44445a;
    }
`;

const GenresContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
`;

const GenreCheckbox = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #fff;

    input {
        margin: 0;
    }
`;

const SelectField = styled.select`
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 5px;
    background-color: #3a3a4a;
    color: #fff;
    font-size: 1rem;
    outline: none;

    &:focus {
        background-color: #44445a;
    }
`;

const FileInput = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 5px;
    background-color: #3a3a4a;
    color: #fff;
    font-size: 1rem;
    outline: none;

    &:focus {
        background-color: #44445a;
    }
`;

const PosterPreview = styled.img`
    max-width: 100%;
    height: auto;
    margin-top: 1rem;
    border-radius: 5px;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
`;

const SubmitButton = styled.button`
    background-color: #ff5555;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #e60000;
    }
`;

const BackButton = styled.button`
    background-color: #4caf50;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049;
    }

    a {
        color: white;
        text-decoration: none;
    }
`;