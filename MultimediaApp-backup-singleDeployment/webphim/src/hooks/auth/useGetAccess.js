import { useContext, useEffect } from 'react';
import { UserContext } from '~/context/authContext';

const useGetAccess = () => {
    const { setAllowAccess } = useContext(UserContext);
    useEffect(() => {
        const getAccess = async () => {
            const response = await fetch('auth/getAccess/', {
                method: 'POST',
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                setAllowAccess(true);
            }
        };
        getAccess();
    }, []);
};

export default useGetAccess;
