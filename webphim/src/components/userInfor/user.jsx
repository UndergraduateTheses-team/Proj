import styled from 'styled-components';
import useLogout from '../../hooks/auth/useLogoutAcount.js';
import {useState,useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import React, { useContext } from 'react';
import { UserContext } from '~/context/authContext.jsx';


function UserDrop() {
    const{id}= useParams();
    const { logout } = useLogout();
    const { user } = useContext(UserContext);
    const [userSave, setUserSave] = useState({});
    const [userInfor, setUserInfor] = useState({
        name: '',
        avatar: '',

    });
    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const response = await fetch(`/Api/api/user/user-by-id/${id}`);
                const dataUser = await response.json();
                if (dataUser.success) {
                    setUserSave(dataUser.data);
                    setUserInfor({
                        name: dataUser.data.name,
                        avatar: dataUser.data.avatar,
                    });
                } else {
                    console.log(dataUser?.message);
                }
            } catch (error) {
                console.log(error); 
            } 
        };
        fetchUserDetail();
    }, [id]);
    return (
        <UserStyle>
            {user ? (
                <div className="dropdownLogin">
                    <button className="dropbtn">
                        <img className='imgAvatar' src={userInfor.avatar} alt="Menu" />
                    </button>

                    <div className="dropdownLogin-content">
                        <Link to={'/profile'}>Profile</Link>
                        <hr className='line'/>
                        <Link to={'/favorite-film'}>Phim yêu thích</Link>
                        <hr className='line'/>
                        {user.isAdmin && <Link to={'/admin'}>Admin Panel</Link>}
                        <hr className='line'/>
                        <a onClick={logout}>Logout</a>
                    </div>
                </div>
            ) : (
                <button style={{background: 'red'}} className="dropbtn">
                    <a href="/login" >Login</a>
                </button>
            )}
        </UserStyle>
    );
}

export default UserDrop;

const UserStyle = styled.div`
    .dropbtn {
        background-color: #e5363600;
        width: 65px;
        height: 65px;
        color: white;
        margin: 10px;
        font-size: 10px;
        border: none;
        padding-left: 10px;
        padding-right: 10px;
    }
    .imgAvatar{
    border-radius:50%;
    }
    .line{
        border-top:1px solid #b7b4b4;
        width:100%;
        
    }
    .dropdownLogin {
        position: relative;
        display: inline-block;
    }

    .dropdownLogin-content {
        display: none;
        position: absolute;
        background-color: #f1f1f1;
        width: 200px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        left: -120px; /* Điều chỉnh giá trị này theo độ rộng của menu */
        border-radius:5px;
    }

    .dropdownLogin-content a {
        color: black;
        padding-top: 15px;
        padding-bottom: 15px;
        text-decoration: none;
        width: 200px;
        display: flex;
        justify-content: center;
    }

    .dropdownLogin-content a:hover {
        background-color: #ddd;
        border-radius:5px;
    }

    .dropdownLogin:hover .dropdownLogin-content {
        display: block;
    }
`;
