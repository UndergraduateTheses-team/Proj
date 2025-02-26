import { useContext, useEffect } from 'react';
import { UserContext } from '~/context/authContext';

const useGetAccess = () => {
    const { setAllowAccess } = useContext(UserContext);
    useEffect(() => {
        const getAccess = async () => {
            const response = await fetch('/Api/api/auth/getAccess/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
