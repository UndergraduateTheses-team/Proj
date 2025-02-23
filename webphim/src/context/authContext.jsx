import { createContext, useState } from 'react';

export const UserContext = createContext();

function AuthContextProvider({ children }) {
    const [allowAccess, setAllowAccess] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    console.log("User from localStorage:", localStorage.getItem('user'));
    return (
        
        <UserContext.Provider value={{ user, setUser, allowAccess, setAllowAccess }}>{children}</UserContext.Provider>
    );
}

export default AuthContextProvider;
