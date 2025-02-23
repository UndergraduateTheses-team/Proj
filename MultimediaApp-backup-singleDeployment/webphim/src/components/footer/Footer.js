/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from 'styled-components';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faHome, faPhone } from '@fortawesome/free-solid-svg-icons';

const cs = classNames.bind(styled);

function Footer({ className }) {
    return (
        <FooterStyle>
            <div className={cs('wrapper', className)}>
                <div className={cs('info')}>
                    <h4 className={cs('heading')}>Contact</h4>
                    <ul className={cs('list')}>
                        <li className={cs('item')}>
                            <a href="tel:phonenumber" className={cs('item-link')}>
                                <FontAwesomeIcon className={cs('icon')} icon={faPhone} />
                                Phone Number : 0337883917
                            </a>
                        </li>

                        <li className={cs('item')}>
                            <a href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox" className={cs('item-link')}>
                                <FontAwesomeIcon className={cs('icon')} icon={faEnvelope} />
                                Email : thanhtam01224@gmail.com
                            </a>
                        </li>

                        <li className={cs('item')}>
                            <a
                                href="https://www.google.com/maps/search/100%2F8+Quang+Trung,+T%C4%83ng+Nh%C6%A1n+Ph%C3%BA+B,+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh/@10.8608434,106.7824432,15z?entry=ttu"
                                className={cs('item-link')}
                            >
                                <FontAwesomeIcon className={cs('icon')} icon={faHome} />
                                Address : To Tang Nhon Phu B-Quan 9-Thu Duc
                            </a>
                        </li>
                    </ul>
                </div>

                <div className={cs('info', 'info_follow')}>
                    <h4 className={cs('heading')}>Follow Me</h4>
                    <ul className={cs('list')}>
                        <li className={cs('item')}>
                            <a href="https://www.facebook.com/ThankTam2208" target="_blank" className={cs('item-link')}>
                                <FontAwesomeIcon className={cs('icon')} icon={faFacebook} />
                                Facebook
                            </a>
                        </li>

                        <li className={cs('item')}>
                            <a
                                href="https://www.instagram.com/triplet_ins22/"
                                target="_blank"
                                className={cs('item-link')}
                            >
                                <FontAwesomeIcon className={cs('icon')} icon={faInstagram} />
                                Instagram
                            </a>
                        </li>

                        <li className={cs('item')}>
                            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className={cs('item-link')}>
                                <FontAwesomeIcon className={cs('icon')} icon={faTelegram} />
                                Telegram
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </FooterStyle>
    );
}

export default Footer;
const FooterStyle = styled.div`
    .wrapper {
        display: flex;
        justify-content: space-around;
        border-top: 2px solid rgb(209, 207, 207);
        background-color: #1f1d1d;
    }
    .info {
      
        margin-bottom: 50px;
    }
    .heading {
        
        text-transform: uppercase;
        color: white;
        margin-top: 30px;
        margin-bottom: 10px;

    }

    .item {
        padding: 4px 0;
        &-link {
            margin-top: 10px;
            
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            &:hover {
                color: #da2020;
            }
        }
    }

    .icon {
        font-size: 1.4rem;
        margin: -1px 4px 0 0;
    }

    @media (max-width: 740px) {
        .wrapper {
            flex-direction: column;
            align-items: center;
        }

        .info_follow {
            width: 336px;
        }
    }
`;
