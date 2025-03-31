import MoviesRow from '~/components/content/MoviesRow';
import Navbar from '~/components/Navbar/Navbar';
import Footer from '~/components/footer/Footer';
import styled from 'styled-components';
import useGetFilmByGenreId from '~/hooks/film/useGetFilmByGenreId';
import { useParams } from 'react-router-dom';

function FindFilmByGenre() {
    const { id } = useParams();
    const { listFilms, genreName } = useGetFilmByGenreId(id);
    console.log(genreName);
    return (
        <ContainFavorite>
            <Navbar />
            <MoviesRow movies={listFilms} title={genreName} />
            <div className="space"></div>
            <Footer />
        </ContainFavorite>
    );
}

export default FindFilmByGenre;

const ContainFavorite = styled.div`
    padding-top: 70px;
    .space {
        height: 38vh;
    }
`;
