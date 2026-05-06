// useAuth.js
import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

const getErrorMessage = (err, fallbackMessage) =>
    err?.response?.data?.message || fallbackMessage;

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");

    const { user, setUser, loading, setLoading, isLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            if (data?.user) {
                setUser(data.user);
                return { success: true, message: data?.message || "Login successful." };
            }
            setUser(null);
            return { success: false, message: "Login failed. Please try again." };
        } catch (err) {
            setUser(null);
            return { success: false, message: getErrorMessage(err, "Login failed. Please try again.") };
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            if (data?.user) {
                setUser(data.user);
                return { success: true, message: data?.message || "Registration successful." };
            }
            setUser(null);
            return { success: false, message: "Registration failed. Please try again." };
        } catch (err) {
            setUser(null);
            return { success: false, message: getErrorMessage(err, "Registration failed. Please try again.") };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            return { success: true, message: "Logged out successfully." };
        } catch (err) {
            setUser(null);
            return { success: false, message: getErrorMessage(err, "Logout failed. Please try again.") };
        } finally {
            setLoading(false);
        }
    };

    // ✅ No useEffect here anymore

    return { user, loading, isLoading, handleRegister, handleLogin, handleLogout };
};