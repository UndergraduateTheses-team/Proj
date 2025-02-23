import styled from 'styled-components';
import useGetEpisodeOfFilm from '~/hooks/episode/useGetEpisodeOfFilm';
import { useParams } from 'react-router-dom';
import useGetFilm from '~/hooks/film/useGetFilm';
import ReactPlayer from 'react-player';
import { useState } from 'react';
import Navbar from '~/components/Navbar/Navbar';
import '../../assets/css/style.css';
import Footer from '~/components/footer/Footer';

import useComment from '../../hooks/comment/useComment.js';
function WatchFilm() {
    //movieID
    const { id } = useParams();
    const { episodeList, currentEpisode, setCurrentEpisode } = useGetEpisodeOfFilm(id);
    const { film } = useGetFilm(id);

    const { createComment, listComment } = useComment(id);
    const [comment, setComment] = useState({
        movieId: id,
        commentContent: '',
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        await createComment(comment);
        setComment({ ...comment, commentContent: '' });
    };
    return (
        <ContainerWatch>
            <Navbar />
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="breadcrumb__links">
                                <span style={{ fontSize: '33px', paddingTop: '50px', color: '#fff' }}>
                                    {film?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="anime-details spad">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="anime__video__player">
                                <ReactPlayer
                                    playing={true}
                                    width="100%"
                                    height="100%"
                                    loop={true}
                                    url={currentEpisode?.videoUrl}
                                    className="videoIntro"
                                    controls
                                />
                            </div>

                            <div className="anime__details__episodes">
                                <div className="section-title">
                                    <h5>List Name</h5>
                                </div>
                                <div className="episode">
                                    {episodeList.map((episode) => (
                                        <a onClick={() => setCurrentEpisode(episode)}>{episode?.name_episode}</a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
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
                                                    {comment.userId.name} - <span>1 Hour ago</span>
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
                                        placeholder="Your Comment"
                                        value={comment.commentContent}
                                        onChange={(e) => {
                                            setComment({ ...comment, commentContent: e.target.value });
                                        }}
                                    ></textarea>
                                    <button type="submit">
                                        <i className="fa fa-location-arrow"></i> Review
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </ContainerWatch>
    );
}

export default WatchFilm;

const ContainerWatch = styled.div`
    /*---------------------
Anime Watching
-----------------------*/
    .episode {
        margin: 5px;
    }
    .anime__video__player {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%; /* Adjust the width as needed */
        max-width: 1200px;
        height: 800px; /* Adjust the height as needed */
    }

    .anime__video__player .plyr--video {
        border-radius: 5px;
        background: transparent;
        width: 100%;
    }

    .anime__video__player .plyr audio,
    .anime__video__player .plyr iframe,
    .anime__video__player .plyr video {
        width: 100%;
    }

    .anime__video__player .plyr--full-ui.plyr--video .plyr__control--overlaid {
        display: block;
    }

    .anime__video__player .plyr--video .plyr__control.plyr__tab-focus,
    .anime__video__player .plyr--video .plyr__control:hover,
    .anime__video__player .plyr--video .plyr__control[aria-expanded='true'] {
        background: transparent;
    }

    .anime__video__player .plyr--video .plyr__controls {
        background: transparent;
    }

    .anime__video__player .plyr--video .plyr__progress__buffer {
        color: transparent;
    }

    .anime__video__player .plyr--full-ui input[type='range'] {
        color: #fff;
    }

    .anime__video__player .plyr__controls .plyr__controls__item.plyr__progress__container {
        position: absolute;
        left: 26px;
        bottom: 45px;
        width: calc(100% - 60px);
    }

    .anime__video__player .plyr__menu {
        margin-right: 70px;
    }

    .anime__video__player .plyr__controls .plyr__controls__item:first-child {
        position: absolute;
        left: 32px;
        bottom: 8px;
    }

    .anime__video__player .plyr__controls .plyr__controls__item:last-child {
        position: absolute;
        right: 32px;
        bottom: 8px;
    }

    .anime__video__player .plyr__volume {
        position: absolute;
        width: auto;
        left: 76px;
        bottom: 8px;
    }

    .anime__video__player .plyr__controls .plyr__controls__item.plyr__time {
        position: absolute;
        left: 106px;
        bottom: 12px;
    }

    .anime__video__player .plyr__control--overlaid {
        background: transparent;
        background: var(
            --plyr-video-control-background-hover,
            var(--plyr-color-main, var(--plyr-color-main, transparent))
        );
    }

    .anime__video__player .plyr__control--overlaid svg {
        height: 60px;
        width: 50px;
    }

    .anime__details__episodes {
        margin-bottom: 35px;
    }

    .anime__details__episodes a {
        display: inline-block;
        font-size: 15px;
        color: #f9f9f9;
        background: rgba(255, 255, 255, 0.2);
        padding: 10px 20px;
        border-radius: 4px;
        margin-right: 15px;
        margin-bottom: 20px;
        transition: all 0.3s;
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    }

    .anime__details__episodes a:hover {
        color: #000;
        background: #fff;
    }

    .breadcrumb-option .container {
        width: 100%;
        padding: 0 15px;
        margin: 0 auto;
    }

    .breadcrumb-option .row {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -15px;
    }

    .breadcrumb-option .col-12 {
        position: relative;
        width: 100%;
        padding: 0 15px;
    }

    .breadcrumb__links {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .breadcrumb__links a {
        color: #000;
        text-decoration: none;
        margin-right: 5px;
        display: flex;
        align-items: center;
    }

    .breadcrumb__links a i {
        margin-right: 5px;
    }

    .breadcrumb__links span {
        margin-left: 5px;
    }

    #player {
        height: 600px;
    }
    .anime-details .container {
        max-width: 1200px;
        padding: 0 15px;
        margin: 0 auto;
    }

    .anime-details .row {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -15px;
    }

    .anime-details .col-8 {
        position: relative;
        width: 66.6667%;
        padding: 0 15px;
    }

    .anime__details__review {
        margin-bottom: 35px;
    }

    .section-title {
        margin-bottom: 20px;
    }

    .section-title h5 {
        font-size: 20px;
        color: #dfdbdb;
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

    .anime__details__form {
        margin-top: 30px;
    }

    .anime__details__form form {
        display: flex;
        flex-direction: column;
    }

    .anime__details__form .textarea {
        resize: none;
        height: 150px;
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
        background: #333;
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
`;
