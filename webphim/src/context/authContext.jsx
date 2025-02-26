import { createContext, useState } from 'react';

export const UserContext = createContext();

function AuthContextProvider({ children }) {
    const [allowAccess, setAllowAccess] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    return (
        <UserContext.Provider value={{ user, setUser, allowAccess, setAllowAccess }}>{children}</UserContext.Provider>
    );
}

export default AuthContextProvider;
