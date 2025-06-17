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
        window.location.href = '/genres';
    };

    return allowAccess ? (
        <>
            <NavbarAdmin />
            <UpdateContainer>
                <EditCard>
                    <h1><FaEdit /> Update Genre</h1>
                    <Instruction>Modify the genre name below and save changes.</Instruction>
                    <EditForm onSubmit={handleSubmit}>
                        <GenreInput
                            type="text"
                            value={genreInfo.name}
                            onChange={(e) => setGenreInfo({ ...genreInfo, name: e.target.value })}
                            placeholder="Enter new genre name"
                            required
                        />
                        <SaveButton type="submit">Save Changes</SaveButton>
                    </EditForm>
                </EditCard>
            </UpdateContainer>
            <Footer />
        </>
    ) : (
        <DenyAccess />
    );
}

export default UpdateGenre;

const UpdateContainer = styled.div`
    background: linear-gradient(to bottom, #1a1a2e, #16213e);
    min-height: calc(100vh - 160px);
    padding: 80px 40px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const EditCard = styled.div`
    background-color: #2a2a3a;
    padding: 2rem 2.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    text-align: center;
    width: 100%;
    max-width: 450px;

    h1 {
        color: #ff4040;
        font-size: 2rem;
        margin-bottom: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }
`;

const Instruction = styled.p`
    color: #ccc;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
`;

const EditForm = styled.form`
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

const SaveButton = styled.button`
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
`;