import { useContext } from 'react';
import { UserContext } from '~/context/authContext';
const useDeleteUser = () => {
    const { setUser } = useContext(UserContext);
    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`/api/user/delete/${userId}`, {
                method: 'DELETE',
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                console.log("xong");
                localStorage.removeItem('user');
                setUser(null);
                window.location.href = '/login'; 
                
            }
            console.log(data?.message);
        } catch (error) {
            console.log(error);
        }
    };

    return { deleteUser };
};

export default useDeleteUser;
