import MoviesRow from '~/components/content/MoviesRow';
import Navbar from '~/components/Navbar/Navbar';
import Footer from '~/components/footer/Footer';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import useSearchFilm from '~/hooks/film/useSeachFilm';
function ResultFilm() {
    const { keyword } = useParams();
    const { searchResult } = useSearchFilm(keyword);
    return (
        <ContainFavorite>
            <Navbar />
            <MoviesRow movies={searchResult} title={`Phim theo tìm kiếm:${keyword}`} />
            <div className="space"></div>
            <Footer />
        </ContainFavorite>
    );
}

export default ResultFilm;

const ContainFavorite = styled.div`
    padding-top: 70px;
    .space {
        height: 38vh;
    }
`;
