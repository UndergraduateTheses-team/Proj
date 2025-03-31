import MoviesRow from '~/components/content/MoviesRow';
import useGetFavoriteFilm from '~/hooks/film/useGetFavoriteFilm.js';
import Navbar from '~/components/Navbar/Navbar';
import Footer from '~/components/footer/Footer';
import styled from 'styled-components';
function ListFavorite() {
    const { listFilms } = useGetFavoriteFilm();

    return (
        <ContainFavorite>
            <Navbar />
            <MoviesRow movies={listFilms} title="Phim yêu thích" />
            <div className="space"></div>
            <Footer />
        </ContainFavorite>
    );
}

export default ListFavorite;

const ContainFavorite = styled.div`
    padding-top: 70px;
    .space {
        height: 38vh;
    }
`;
