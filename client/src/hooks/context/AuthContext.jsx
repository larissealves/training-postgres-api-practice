import { createContext, useContext, useEffect, useState } from "react";


const Auth = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:3000/api/me", {
            credentials: "include"
        })
        .then( async (res) => {
            if (!res.ok) {
                setUser(null);
                return;
            }

            const data = await res.json();
            console.log('useeee', data)
            setUser(data.user);
        })

        .catch(() => {
            setUser(null);
        })

        .finally(() => {
            setLoading(false);
        })

    }, []);

    return(
        <Auth.Provider value={{user, setUser, loading}}>
            {children}
        </Auth.Provider>
    );
}

export function useAuth() {
    return useContext(Auth);
}