import { createContext, useState, useEffect, ReactNode } from "react";

// Define a type for user authentication
interface AuthUser {
    _id: string;
    fullName: string;
    email: string;
    avatar: string;
}

interface AuthContextType {
    auth: AuthUser | null;
    setAuth: (user: AuthUser | null) => void;
}

// Create context with a default value of `null`
export const AuthContext = createContext<AuthContextType>({
    auth: null,
    setAuth: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthUser | null>(() => {
        // Load user data from localStorage on initial render
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // ✅ Listen for storage events (for cross-tab logout)
    useEffect(() => {
        const syncAuth = () => {
            const storedUser = localStorage.getItem("user");
            setAuth(storedUser ? JSON.parse(storedUser) : null);
        };
        window.addEventListener("storage", syncAuth);
        return () => window.removeEventListener("storage", syncAuth);
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
