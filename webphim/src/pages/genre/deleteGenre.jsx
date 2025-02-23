import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useDeleteGenre from '~/hooks/genre/useDeleteGenre';
import { UserContext } from '~/context/authContext';
import styled from 'styled-components';

import Footer from '~/components/footer/Footer';
import DenyAccess from '~/components/access/403';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';

const DeleteGenre = () => {
    const { allowAccess } = useContext(UserContext);
    const { id } = useParams();
    const { deleteGenre } = useDeleteGenre();
    const [genreInfo, setGenreInfo] = useState({
        name: '',
    });

    useEffect(() => {
        const getGenre = async () => {
            try {
                const response = await fetch(`/api/genres/${id}`,{
                    credentials: "include",
                });
                const data = await response.json();
                if (!response.ok) {
                    console.log(data.message);
                }
                setGenreInfo(data.datas);
            } catch (error) {
                console.log(error);
            }
        };
        getGenre();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await deleteGenre(genreInfo._id);
    };

    return allowAccess ? (
        <StyledContainer>
            <NavbarAdmin />
            <StyledForm onSubmit={handleSubmit}>
                <h1>Are you sure?</h1>
                <label>Genres name</label>
                <span>{genreInfo.name}</span>
                <button type="submit">Confirm delete</button>
            </StyledForm>
            <Footer />
        </StyledContainer>
    ) : (
        <DenyAccess />
    );
};

export default DeleteGenre;

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Ensure the container takes full viewport height */
`;

const StyledForm = styled.form`
    width: 80vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 13%;
    margin-bottom: 14.5%;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-left: 10%;

    h1 {
        font-size: 40px;
        margin-bottom: 20px;
    }

    label {
        font-size: 18px;
        margin-bottom: 10px;
    }

    span {
        font-size: 16px;
        margin-bottom: 20px;
    }

    button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #f44336;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #d32f2f;
        }
    }
`;
