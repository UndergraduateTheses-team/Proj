import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useUpdateGenre from '~/hooks/genre/useUpdateGenre';
import { UserContext } from '~/context/authContext';
import DenyAccess from '~/components/access/403';
import styled from 'styled-components';

import Footer from '~/components/footer/Footer';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';

function UpdateGenre() {
    const { allowAccess } = useContext(UserContext);
    const [genreInfo, setGenreInfo] = useState({
        name: '',
    });
    const { id } = useParams();
    const { updateGenre } = useUpdateGenre();

    useEffect(() => {
        const getGenre = async () => {
            try {
                const response = await fetch(`/api/genres/${id}`,{
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok) {
                    setGenreInfo(data.datas);
                }
                console.log(data?.message);
            } catch (error) {
                console.log(error);
            }
        };
        getGenre();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await updateGenre(genreInfo, id);
    };

    return allowAccess ? (
        <>
            <NavbarAdmin />
            <StyledContainer>
                <StyledForm onSubmit={handleSubmit}>
                    <StyledInput
                        type="text"
                        onChange={(event) => setGenreInfo({ ...genreInfo, name: event.target.value })}
                        value={genreInfo.name}
                        placeholder="Enter genre name"
                    />
                    <StyledButton type="submit">Update</StyledButton>
                </StyledForm>
            </StyledContainer>
            <Footer />
        </>
    ) : (
        <DenyAccess />
    );
}

export default UpdateGenre;

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 81vh;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 40%;

    @media (max-width: 768px) {
        width: 80%;
    }
`;

const StyledInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
`;

const StyledButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }
`;
