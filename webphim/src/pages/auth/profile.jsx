import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUpdateUser from '~/hooks/user/useUpdatebyUser';
import Footer from '~/components/footer/Footer';
import Navbar from '~/components/Navbar/Navbar';
import useDeleteUser from '~/hooks/user/useDeleteUser';
import ConfirmDialog from '../film/confirmDialog';
import useLogout from '~/hooks/auth/useLogoutAcount';

function Profile() {
    const { id } = useParams();
    // const { id } = "676ad59658f32858dfdae5bb";
    const [user, setUser] = useState({});
    const { logout } = useLogout();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { deleteUser } = useDeleteUser();
    const [selectedId, setSelectedId] = useState(null);

    const handleDelete = (id) => {
        setSelectedId(id);
        setShowConfirmDialog(true);
    };

    const confirmDelete = async () => {
        await deleteUser(selectedId);
        logout();
        setSelectedId(null);
        setShowConfirmDialog(false);
        
    };

    const cancelDelete = () => {
        setShowConfirmDialog(false);
    };

    const [userInfor, setUserInfor] = useState({
        name: '',
        avatar: '',
    });

    const { updateUser } = useUpdateUser(id);

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const response = await fetch(`/api/user/user-by-id/${id}`,{
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const dataUser = await response.json();
                if (dataUser.success) {
                    setUser(dataUser.data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUser({ ...userInfor });
        window.location.href= '/profile';
    };

    return (
        <>
            <Navbar />
            <ProfileStyle>
                <div className="content-wrapper">
                    <div className="wrapper">
                        <form className="formUser" onSubmit={handleSubmit}>
                            <h4 className="header">Thông Tin Cá Nhân</h4>
                            <div className="container">
                                <div className="info">
                                    <h4 className="title">Thông tin người dùng</h4>
                                    <div className="content">
                                        <div className="infoUser">
                                            <p className="contentTitle">Tên</p>
                                            <input
                                                type="text"
                                                className="infoText"
                                                value={userInfor.name}
                                                name="name"
                                                onChange={(e) => {
                                                    setUserInfor({ ...userInfor, name: e.target.value });
                                                }}
                                            />
                                        </div>
                                        <div className="infoUser">
                                            <p className="contentTitle">Email</p>
                                            <input type="text" className="infoText" value={user.email} disabled />
                                        </div>
                                        <div className="delete">
                                            <button className="deleteBtn" type="submit">
                                                Cập nhật thông tin
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="picture">
                                    <h4 className="title">Ảnh đại diện</h4>
                                    <div className="pictureContain">
                                        <img className="imageProfile" alt="" src={user.avatar} />
                                    </div>
                                    <div className="uploadContain">
                                        <button className="uploadBtn" type="button">
                                            Chọn ảnh mới
                                        </button>
                                        <input
                                            className="chooseFile"
                                            type="file"
                                            accept="image/*"
                                            name="avatar"
                                            onChange={(e) => {
                                                setUserInfor({ ...userInfor, avatar: e.target.files[0] });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                        <button className="deleteBtnn" onClick={() => handleDelete(user._id)}>
                            Xóa tài khoản
                        </button>
                    </div>
                </div>
                {showConfirmDialog && (
                    <ConfirmDialog
                        message="Bạn có chắc chắn muốn xóa không?"
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                    />
                )}
            </ProfileStyle>
            <Footer />
        </>
    );
}

export default Profile;

const ProfileStyle = styled.div`
    
    .content-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        width: 100%;
    }
    .formUser{
    width:50%;
    
    }

    .wrapper {
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .headerr {
        font-size: 3.5rem;
        color: white;
        border-bottom: 1px solid rgba(22, 24, 35, 0.1);
        text-align: center;
        width: 100%;
    }

    .container {
        display: flex;
        justify-content: center;
        margin-top: 10px;
        width: 100%;
        max-width: 1200px;
    }
    

    .title {
        margin-top: 30px;
        font-size: 2.5rem;
        color: white;
    }

    .info {
        flex: 1;
        border-right: 1px solid rgba(22, 24, 35, 0.1);
        padding-right: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .content {
        align-self: center;
    }
    .infoText{
        background-color: white;
        margin-top: 20px;
        padding: 15px;
        border-radius: 10px;
        width: 100%;
    }
    .infoUser {
        background-color: rgba(22, 24, 35, 0.1);
        margin-top: 20px;
        margin-bottom: 30px;
        padding: 5px;
        border-radius: 10px;
        width: 100%;
        max-width: 500px;
    }

    .contentTitle {
        font-weight: 550;
        font-size: 1.8rem;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .iconTitle {
        margin-right: 7px;
        font-size: 1.8rem;
    }

    .usernamemail {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        margin-left: 8px;
        font-size: 1.6rem;
        width: 100%;
    }

    .iconEdit {
        padding: 0 10px;
        font-size: 2rem;
        cursor: pointer;
    }

    .infoInput {
        padding: 9px 20px;
        background-color: white;
        caret-color: var(--primary);
        width: 90%;
        border-radius: 10px;
        font-size: 1.5rem;
    }

    .iconSent {
        float: right;
        margin-right: 8px;
        cursor: pointer;
    }

    .delete {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .deleteBtn {
        padding: 10px 20px;
        color: var(--primary);
        font-size: 1.5rem;
        border-radius: 10px;
        margin:10px;
        text-align: center;
    }
    .deleteBtnn {
        padding: 10px 20px;
        color: var(--primary);
        font-size: 1.5rem;
        border-radius: 10px;
        margin:10px;
        display: flex;
        text-align: center;
    }
    .picture {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-left: 10px;
    }

    .pictureContain {
        align-self: center;
        position: relative;
        margin-top: 20px;
    }

    .imageProfile {
        width: 250px;
        height: 250px;
        object-fit: cover;
        border-radius: 50%;
        border: 2px solid rgba(22, 24, 35, 0.5);
    }

    .iconLoading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5rem;
        color: rgba(22, 24, 35, 0.5);
        animation: spinner 0.8s linear infinite;
    }

    @keyframes spinner {
        from {
            transform: translate(-50%, -50%) rotate(0);
        }
        to {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }

    .uploadContain {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        margin-top: 40px;
    }

    .uploadBtn {
        height: 40px;
        background-color: white;
        border-radius: 20px;
        font-size: 1.7rem;
        padding: 10px 10px;
        height: 65px;
        max-width: 190px;
        display: flex;
        align-items: center;
        color: black;
        justify-content: center;
        &:hover {
            opacity: 0.8;
            cursor: pointer;
        }
    }

    .iconUpload {
        transform: rotate(-90deg);
        color: var(--primary);
        margin-right: 10px;
    }

    .chooseFile {
        position: absolute;
        max-width: 190px;
        top: 10%;
        opacity: 0;
        padding: 5px 0;
        z-index: 9999;
    }
`;
