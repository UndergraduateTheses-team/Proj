import { useContext } from 'react';
import { UserContext } from '~/context/authContext';

const useLogout = () => {
    const { setUser } = useContext(UserContext);

    const logout = async () => {
        try {
            const response = await fetch('/Api/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const data = await response.json();
                console.log(data?.message);
            } else {
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return { logout };
};

export default useLogout;
