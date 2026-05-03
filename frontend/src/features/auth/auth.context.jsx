import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";  // ⚠️ update this path if needed

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ true initially, app is loading

    // ✅ Runs only ONCE when app starts
    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            try {
                const data = await getMe();
                if (data && data.user) setUser(data.user);
            } catch (err) {
                if (err?.response?.status === 401) {
                    setUser(null); // not logged in, totally fine
                } else {
                    console.error("Auth init failed:", err);
                }
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []); // ✅ empty array = runs once only

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};