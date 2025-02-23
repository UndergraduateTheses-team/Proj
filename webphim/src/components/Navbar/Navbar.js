import styled from 'styled-components';
import { useState, useEffect } from 'react';
import logoImage from '../../assets/images/logo.png';
import { FaSearch } from 'react-icons/fa';
import '../../App.css';
import '../../assets/css/style.css';
import { useScrollY } from '../hook';
import { Link, useParams } from 'react-router-dom';
import UserDrop from '../userInfor/user';
import useSearchFilm from '~/hooks/film/useSeachFilm';
function Navbar() {
    const{id} = useParams();
    const [genresList, setGenresList] = useState([]);
    const [keyWord, setKeyWord] = useState('');
    const { searchFilms, searchResult } = useSearchFilm();
    
    useEffect(() => {
        const getGenreList = async () => {
            const response = await fetch('/api/genres/',{
                method: 'GET',
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                setGenresList(data.datas);
            } else {
                console.log(response.message);
            }
        };
        getGenreList();
    }, []);

    

    const handleSearch = async () => {
        // await searchFilms(keyWord);
        window.location.href = `/search-film/${keyWord}`;
    };
    const handleGenreClick = (genreId) => {
        window.location.href = `/find-by-genre/${genreId}`;
    };

    const [scrollY] = useScrollY();
    return (
        <Navigation
            style={scrollY < 50 ? { backgroundColor: 'transparent' } : { backgroundColor: 'var(--color-background)' }}
        >
            <div className="navContainer">
                <div className="row">
                    <div className="col-lg-2">
                        <div className="header__logo">
                            <Link to={'/'}>
                                <img src={logoImage} alt="" />
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="header__nav">
                            <nav className="header__menu mobile-menu">
                                <ul>
                                    <li className="active">
                                        <Link to={'/'}> Home Page</Link>
                                    </li>
                                    <li className="active">
                                        <a href="#">
                                            Thể loại <span className="arrow_carrot-down"></span>
                                        </a>
                                        <ul className="dropdown">
                                            {genresList.map((genre) => {
                                                return (
                                                    <li
                                                        key={genre._id}
                                                        onClick={() => {
                                                            handleGenreClick(genre._id);
                                                        }}
                                                    >
                                                        <a className="active">{genre.name}</a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="header__right">
                            <Link>
                                <div className="navSearch">
                                    <FaSearch onClick={handleSearch} className="iconSearch" />
                                    <input
                                        placeholder="Search here!"
                                        type="text"
                                        onChange={(e) => {
                                            setKeyWord(e.target.value);
                                        }}
                                    />
                                </div>
                            </Link>
                            <Link to={'/login'}>
                                <div className="navLogin">
                                    <UserDrop />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Navigation>
    );
}

export default Navbar;

const Navigation = styled.div`
    width: 100%;
    height: 70px;
    position: fixed;
    top: 0;
    transition-timing-function: ease-in;
    transition: all 1s;
    z-index: 10;

    @media only srceen and (max-width: 600px) {
        height: 100px;
    }

    .navContainer {
        background-color: transparent;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        height: 100%;

        @media only srceen and (max-width: 600px) {
            flex-direction: column;
        }
    }
    .row {
        width: 100%;
        height: 70px;
        position: fixed;
        top: 0;
        transition-timing-function: ease-in;
        transition: all 1s;
        z-index: 10;
    }

    .logo {
        width: 100px;
        cursor: pointer;
        img {
            width: 100%;
        }
    }
    .navSearch {
        color: var(--color-white);
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover .iconSearch {
            color: var(--color-white);
        }

        .iconSearch {
            width: 20px;
            height: 20px;
            margin-bottom: 20px;
            cursor: pointer;
            transform: translateX(26px) translateY(10px);
            color: #bbb;
        }

        input {
            font-size: 14px;
            border: 1px solid #fff;
            border-radius: 10px;
            color: white;
            outline: none;
            width: 200px;
            padding: 10px;
            cursor: pointer;
            opacity: 1;
            background: var(--color-background);
            transition: width 0.5s;
            text-align: center;
        }
    }
    .navLogin {
        color: var(--color-white);
        padding-right: 20px;
        display: flex;
        justify-content: flex-end;

        &:hover .iconSearch {
            color: var(--color-white);
        }
    }
    .col-lg-2 {
        display: flex;
        justify-content: space-between;
        align-item: center;
        justify-content: center;
    }
`;
