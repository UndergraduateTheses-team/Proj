import { useContext } from 'react';
import { UserContext } from '~/context/authContext';

const useCreateAccount = () => {
    const { setUser } = useContext(UserContext);
    const createAccount = async (infor) => {
        try {
            const response = await fetch('/Api/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials:'include',
                body: JSON.stringify(infor),
            });
            const data = await response.json();
            if (!response.ok) {
                console.log(data?.message);
            } else {
                setUser(data.datas);
                localStorage.setItem('user', JSON.stringify(data.datas));
            }
        } catch (error) {
            console.log(error);
        }
    };
    return { createAccount };
};

export default useCreateAccount;
