import styled from 'styled-components';
import '../../assets/css/style.css';
import '../../assets/css/elegant-icons.css';
import Navbar from '~/components/Navbar/Navbar';
import useCreateAccount from '~/hooks/auth/useCreateAcount';
import { useState } from 'react';

function Register() {
    const { createAccount } = useCreateAccount();

    const [userInfor, setUserInfor] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        await createAccount(userInfor);
    };

    const allInputFilled = () => {
        if (!userInfor.email && !userInfor.password && !userInfor.password && !userInfor.confirmPassword) {
            return false;
        }
        return true;
    };
    return (
        <RegisterDiv>
            <>
                <Navbar />
                <section className="normal-breadcrumb set-bg" data-setbg="img/normal-breadcrumb.jpg">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <div className="normal__breadcrumb__text">
                                    <h2>Sign Up</h2>
                                    <p>Welcome to the Movie Web.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="signup">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login__form">
                                <h3>Sign Up</h3>
                                <form className="form_sigup" onSubmit={handleSubmit}>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="Email address"
                                            onChange={(e) => {
                                                setUserInfor({ ...userInfor, email: e.target.value });
                                            }}
                                        />
                                        <span className="icon_mail"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            onChange={(e) => {
                                                setUserInfor({ ...userInfor, name: e.target.value });
                                            }}
                                        />
                                        <span className="icon_profile"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            onChange={(e) => {
                                                setUserInfor({ ...userInfor, password: e.target.value });
                                            }}
                                        />
                                        <span className="icon_lock"></span>
                                    </div>
                                    <div className="input__item">
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            onChange={(e) => {
                                                setUserInfor({ ...userInfor, confirmPassword: e.target.value });
                                            }}
                                        />
                                        <span className="icon_lock"></span>
                                    </div>
                                    <button type="submit" className="site-btn">
                                        Sign Up
                                    </button>
                                </form>
                                <h5>
                                    Already have an account? <a href="#">Log In!</a>
                                </h5>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="login__social__links">
                                <h3>Login With:</h3>
                                <ul>
                                    <li>
                                        <a href="#" className="google">
                                            <i className="fa fa-google"></i> Sign in With Google
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        </RegisterDiv>
    );
}

export default Register;
const RegisterDiv = styled.div`
    .container {
        display: flex;
        align-item: center;
    }
`;
