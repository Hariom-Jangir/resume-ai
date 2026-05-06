import { createContext, useState, useEffect, useRef } from "react";
import { getMe } from "./services/auth.api";  // ⚠️ update this path if needed
import { setUnauthorizedHandler } from "../../shared/apiClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isHandlingUnauthorizedRef = useRef(false);

    // ✅ Runs only ONCE when app starts
    useEffect(() => {
        setUnauthorizedHandler((error) => {
            if (isHandlingUnauthorizedRef.current) return;
            isHandlingUnauthorizedRef.current = true;
            setUser(null);
            setLoading(false);
            setIsLoading(false);
            const message = error?.response?.data?.message || "Session expired, please login again";
            const isLoginPath = window.location.pathname === "/login";
            const shouldNotify = message.toLowerCase().includes("expired") || !isLoginPath;
            if (shouldNotify) {
                window.alert(message);
            }
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
            setTimeout(() => {
                isHandlingUnauthorizedRef.current = false;
            }, 0);
        });

        const initAuth = async () => {
            try {
                const data = await getMe();
                if (data && data.user) setUser(data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setIsLoading(false);
                setLoading(false);
            }
        };
        initAuth();

        return () => {
            setUnauthorizedHandler(null);
        };
    }, []); // ✅ empty array = runs once only

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, isLoading, setIsLoading }}>
            {children}
        </AuthContext.Provider>
    );
};