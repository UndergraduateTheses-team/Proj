import { useContext } from 'react';
import { UserContext } from '~/context/authContext';
import toast from 'react-hot-toast';
const useLoginAccount = () => {
    const { setUser } = useContext(UserContext);

    const loginAccount = async (infor) => {
        try {
            const response = await fetch('/Api/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(infor),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data?.message);
            } else {
                console.log(data?.message);
                setUser(data.data);
                localStorage.setItem('user', JSON.stringify(data.data));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return { loginAccount };
};

export default useLoginAccount;
