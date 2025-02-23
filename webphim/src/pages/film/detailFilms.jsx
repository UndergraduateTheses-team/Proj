import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import useGetFilm from '~/hooks/film/useGetFilm';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '~/context/authContext';
import useFollowFilm from '~/hooks/film/useFollowFilm';
import Footer from '~/components/footer/Footer';
import useComment from '../../hooks/comment/useComment.js';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin';
import { FaStar } from 'react-icons/fa';
import useRatingFilm from '~/hooks/film/useRatingFilm.js';

function DetailFilm() {
    const { id } = useParams();
    const { allowAccess } = useContext(UserContext);
    const { film } = useGetFilm(id);
    const { FollowFilm } = useFollowFilm();
    const [isFollowed, setIsFollowed] = useState(false);
    const [message, setMessage] = useState('');
    const [genresList, setGenresList] = useState([]);

    const { RatingFilm, rate, setRate } = useRatingFilm(id);

    useEffect(() => {
        if (allowAccess?.favorite?.includes(id)) {
            setIsFollowed(true);
        }
    }, [allowAccess, id]);

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
        getGenreList();
    }, []);

    const handleFollow = async (e) => {
        e.preventDefault();
        try {
            const { response, data } = await FollowFilm(id);
            if (response.status === 200) {
                setMessage(data.message);
                setIsFollowed(!isFollowed);
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            console.error('Error !!!', error);
        }
    };

    const [comment, setComment] = useState({
        movieId: id,
        commentContent: '',
    });
    const { createComment, listComment } = useComment(id);
    const handleSubmit = async (e) => {
        e.preventDefault();
        await createComment(comment);
        setComment({ ...comment, commentContent: '' });
    };

    function convertToVietnamDate(dateString) {
        // Tạo đối tượng Date từ chuỗi ngày giờ UTC
        let date = new Date(dateString);

        // Chuyển đổi giờ UTC sang múi giờ GMT+7 của Việt Nam
        let vietnamOffset = 7 * 60; // GMT+7 tính bằng phút
        let localOffset = date.getTimezoneOffset(); // Lấy độ lệch múi giờ của địa phương (UTC) so với GMT
        let vietnamTime = new Date(date.getTime() + (vietnamOffset + localOffset) * 60000); // Chuyển đổi thời gian

        // Định dạng ngày tháng năm theo định dạng dd/MM/yyyy
        let day = vietnamTime.getDate();
        let month = vietnamTime.getMonth() + 1; // Tháng trong JavaScript tính từ 0
        let year = vietnamTime.getFullYear();

        // Đảm bảo định dạng dd/MM/yyyy
        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;

        return `${day}/${month}/${year}`;
    }

    return (
        <ContainerDetail>
            <NavbarAdmin />
            <div className="canhGiua ">
                <div className="anime-details-spad">
                    <div className="container">
                        <div className="anime__details__content">
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="anime__details__pic" data-setbg="img/anime/details-pic.jpg">
                                        <img src={film?.poster_img} />
                                        <div className="view">
                                            <i className="fa fa-eye"> View: {film?.viewed}</i>
                                        </div>
                                    </div>
                                    <div className="ratingPoint">
                                        <FaStar
                                            className="starPoint"
                                            onClick={() => {
                                                setRate(1);
                                                RatingFilm(id, 1);
                                            }}
                                            color={1 <= rate ? 'yellow' : 'gray'}
                                        />
                                        <FaStar
                                            className="starPoint"
                                            onClick={() => {
                                                setRate(2);
                                                RatingFilm(id, 2);
                                            }}
                                            color={2 <= rate ? 'yellow' : 'gray'}
                                        />
                                        <FaStar
                                            className="starPoint"
                                            onClick={() => {
                                                setRate(3);
                                                RatingFilm(id, 3);
                                            }}
                                            color={3 <= rate ? 'yellow' : 'gray'}
                                        />
                                        <FaStar
                                            className="starPoint"
                                            onClick={() => {
                                                setRate(4);
                                                RatingFilm(id, 4);
                                            }}
                                            color={4 <= rate ? 'yellow' : 'gray'}
                                        />
                                        <FaStar
                                            className="starPoint"
                                            onClick={() => {
                                                setRate(5);
                                                RatingFilm(id, 5);
                                            }}
                                            color={5 <= rate ? 'yellow' : 'gray'}
                                        />
                                    </div>
                                    <p className='rateTitle'>Đánh giá của bạn</p>
                                </div>
                                <div className="col-lg-9">
                                    <div className="anime__details__text">
                                        <div className="anime__details__title">
                                            <h3>{film?.name}</h3>
                                        </div>
                                        <div className="anime__details__rating">
                                            <div className="rating">
                                                <a href="#">
                                                    <i className="fa fa-star"></i>
                                                </a>
                                                <a href="#">
                                                    <i className="fa fa-star"></i>
                                                </a>
                                                <a href="#">
                                                    <i className="fa fa-star"></i>
                                                </a>
                                                <a href="#">
                                                    <i className="fa fa-star"></i>
                                                </a>
                                                <a href="#">
                                                    <i className="fa fa-star-half-o"></i>
                                                </a>
                                            </div>
                                            {/* <span>1.029 Votes</span> */}
                                        </div>
                                        <p>{film?.description}</p>
                                        <div className="anime__details__widget">
                                            <div className="row-detail">
                                                <div className="col-lg-6">
                                                    <ul>
                                                        <li>
                                                            <span>Genres:</span>
                                                            {
                                                                <ul>
                                                                    {film?.genres.map((genre) => (
                                                                        <li
                                                                            key={genre._id}
                                                                            style={{ listStyleType: 'none ' }}
                                                                        >
                                                                            {genre.name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            }
                                                        </li>
                                                        <li>
                                                            <span>Country:</span> {film?.country}
                                                        </li>
                                                        <li>
                                                            <span>Actors:</span> {film?.actors}
                                                        </li>
                                                        <li>
                                                            <span>Status:</span> {film?.status}
                                                        </li>
                                                        <li>
                                                            <span>Director:</span> {film?.director}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="col-lg-6">
                                                    <ul>
                                                        <li>
                                                            <span>ReleaseDate:</span>
                                                            {convertToVietnamDate(film?.releaseDate)}
                                                        </li>
                                                        <li>
                                                            <span>TotalChap:</span> {film?.totalChap}
                                                        </li>
                                                        <li>
                                                            <span>MovieDuration:</span> {film?.movieDuration } phút
                                                        </li>
                                                        <li>
                                                            <span>Views:</span> {film?.viewed}
                                                        </li>
                                                        <li>
                                                            <span>Rate:</span>{`${(film?.totalPoints/film?.countRating).toFixed(1)} điểm / ${film?.countRating} lượt`} 
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="anime__details__btn">
                                            <Link className="watch-btn" to={`/film/watch/${film?._id}`}>
                                                Watch Now
                                            </Link>
                                            <button onClick={handleFollow} className="follow-btn">
                                                {isFollowed ? 'Unfollow' : 'Follow'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rowa">
                            <div className="col-8">
                                <div className="row">
                                    <div className="col-8">
                                        <div className="anime__details__review">
                                            <div className="section-title">
                                                <h5>Reviews</h5>
                                            </div>
                                            {listComment.map((comment) => {
                                                return (
                                                    <div className="anime__review__item">
                                                        <div className="anime__review__item__pic">
                                                            <img src={comment.userId.avatar} alt="" />
                                                        </div>
                                                        <div className="anime__review__item__text">
                                                            <h6>
                                                                {comment.userId.name} -{' '}
                                                                <span>{convertToVietnamDate(comment.createdAt)}</span>
                                                            </h6>
                                                            <p>{comment.content}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="anime__details__form">
                                            <div className="section-title">
                                                <h5>Your Comment</h5>
                                            </div>
                                            <form onSubmit={handleSubmit}>
                                                <textarea
                                                    className="textarea"
                                                    placeholder="Your Comment"
                                                    onChange={(e) => {
                                                        setComment({ ...comment, commentContent: e.target.value });
                                                    }}
                                                    value={comment.commentContent}
                                                ></textarea>
                                                <button type="submit">
                                                    <i className="fa fa-location-arrow"></i> Review
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </ContainerDetail>
    );
}
export default DetailFilm;
const ContainerDetail = styled.div`
    .canhgiua {
        display: flex;
        justify-content: center;
        align-item: center;
    }
    .ratingPoint {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    .starPoint {
        font-size: 45px;
        color: gray;
        margin-top: 10px;
        margin-right: 10px;
    }

    .anime-details {
        display: flex;
        justify-content: center; /* Canh giữa form */
    }

    .anime__details__content {
        display: flex;
        align-items: center;

        width: 1100px;
        height: 700px;
        margin-top: 50px; /* Điều chỉnh khoảng cách giữa ảnh và nội dung chữ */
        box-shadow: 0 0 7px #fff;
        padding: 20px;
        border-radius: 8px;
        align-self: center;
    }

    .anime__details__pic {
        position: relative;
    }

    .anime__details__pic img {
        height: 450px;
        width: 300px;
        margin-top:10px;
        border-radius:5px;
    }

    .anime__details__pic .comment,
    .anime__details__pic .view {
        position: absolute;
        bottom: 10px;
        left: 10px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 5px 10px;
        border-radius: 5px;
    }

    .anime__details__pic .view {
        left: auto;
        right: 10px;
    }
    .rateTitle{
        display:flex;
        justify-content:center;
        margin-top:20px;
    }
    .anime__details__text {
        margin-left: 30px;
        margin-top:10px; /* Điều chỉnh khoảng cách giữa ảnh và nội dung chữ */
    }

    .anime__details__btn {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    .anime__details__form {
        margin-top: 30px;
    }

    .anime__details__form form {
        display: flex;
        flex-direction: column;
    }

    .anime__details__form .textarea {
        resize: none;
        height: 100px;
        width: 500px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 15px;
        font-size: 14px;
        color: #333;
    }

    .anime__details__form button {
        align-self: flex-end;
        padding: 10px 20px;
        background: #9a8686;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .anime__details__form button:hover {
        background: #555;
    }

    .anime__details__form button i {
        margin-right: 5px;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        margin-top: 100px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(255, 255, 255) 0px 0px 0px 3px;
        padding: 20px; /* Tùy chỉnh khoảng cách nếu cần */
        border-radius: 8px;
        margin-bottom: 50px;
        background-color:#0a0c3b;
    }

    .anime-details-form {
        width: 45%; /* Adjust as needed */
    }

    .anime-details-text {
        background: #fff;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
    }

    .anime-details-title h3 {
        font-size: 24px;
        margin-bottom: 10px;
    }

    .anime-details-title span {
        font-size: 14px;
        color: #777;
    }

    .anime-details-rating {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }

    .rating a {
        color: #f39c12;
        font-size: 20px;
        margin-right: 5px;
    }

    .rating a:hover {
        color: #e67e22;
    }

    .anime-details-rating span {
        font-size: 14px;
        color: #777;
        margin-left: 10px;
    }

    .anime-details-text p {
        font-size: 14px;
        color: #555;
        line-height: 1.6;
        margin-bottom: 15px;
    }

    .anime-details-widget {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .row {
        display: flex;
        justify-content: space-between;
        border: 0;
        margin: 0;

        box-sizing: border-box;
    }

    .rowa {
        display: flex;
        justify-content: space-between;
        border: 0;
        margin: 0;
        padding-left: 6%;
        box-sizing: border-box;
    }

    .column {
        width: 48%;
    }

    .column ul {
        list-style: none;
        padding: 0;
    }

    .column ul li {
        margin-bottom: 10px;
        font-size: 14px;
        color: #555;
    }

    .column ul li span {
        font-weight: bold;
        color: #333;
    }

    .anime-details-btn a {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 20px;
        font-size: 14px;
        color: #fff;
        border-radius: 5px;
        text-decoration: none;
    }

    .watch-btn {
        background-color: #3498db;
        display: flex;
        align-items: center;
        padding: 8px;
        border-radius: 9px;
    }

    .watch-btn span {
        margin-right: 5px;
    }
    .watch-btn {
        background-color: #3498db;
        display: flex;
        align-items: center;
        padding: 8px;
        border-radius: 9px;
    }

    .watch-btn span {
        margin-right: 5px;
    }

    .follow-btn:hover,
    .watch-btn:hover {
        opacity: 0.8;
    }
    .anime__review__item {
        display: flex;
        margin-bottom: 20px;
    }

    .anime__review__item__pic {
        margin-right: 20px;
    }

    .anime__review__item__pic img {
        width: 100%;
        border-radius: 5px;
    }

    .anime__review__item__text {
        max-width: 70%;
    }

    .anime__review__item__text h6 {
        font-size: 16px;
        color: fffefe;
        margin-bottom: 10px;
    }

    .anime__review__item__text p {
        font-size: 14px;
        color: #a8a8a8;
    }
    .col-lg-9 {
        display: flex;
        align-items: center;
        padding-left: 3%;
    }
    .row-detail {
        display: flex;
        justify-content: space-between;
        width: 28vw;
    }
`;
