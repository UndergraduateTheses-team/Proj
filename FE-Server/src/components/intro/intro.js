import styled from 'styled-components';
import { useEffect, useState } from 'react';
import animeBg from '../../assets/images/AnimeIntro.jpg'; // make sure this path is correct!

const quotes = [
    "Anime is not just a form of entertainment, it's a way of life.",
    "In anime, even the impossible becomes possible.",
    "A single moment can define a lifetime — that's the beauty of anime.",
    "Anime tells stories our hearts didn’t know they needed.",
    "Reality is tough, that’s why we have anime."
];

function AnimeIntro() {
    const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimeContainer>
            <div className="overlay" />
            <div className="content">
                <h1 style={{ fontWeight: 'bold', fontSize: '100px' }}>
                    <span style={{ color: 'white' }}>Ani</span>
                    <span style={{ color: 'red' }}>me</span>
                </h1>
                <p className="quote">"{quotes[quoteIndex]}"</p>
            </div>
            <div className="fadeBottom" />
        </AnimeContainer>
    );
}

export default AnimeIntro;

// Styled Component
const AnimeContainer = styled.div`
    position: relative;
    height: 100vh;
    width: 100%;
    background-image: url(${animeBg});
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    overflow: hidden;

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 1;
    }

    .content {
        z-index: 2;
        text-align: center;
        padding: 0 20px;

        h1 {
            margin-bottom: 50px; /* Adds vertical space between title and quote */
        }

        .quote {
            font-size: 24px;
            max-width: 700px;
            margin-top: 0;
            padding-top: 10px;
            font-style: italic;
            transition: opacity 0.5s ease-in-out;

            @media (max-width: 768px) {
                font-size: 18px;
            }
        }
    }

    .fadeBottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 120px;
        background: linear-gradient(to bottom, transparent, #111);
        z-index: 2;
    }
`;
