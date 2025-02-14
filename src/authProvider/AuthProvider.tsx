import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    name: string;
    id: number;
    email: string;
    user_name: string
}

type AuthContextType = {
    isAuthenticated: boolean;
    storeToken: (token: string, data: User) => void;
    logout: () => void;
    user: User | null;
    accessToken: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem("token"));
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function storeToken(token: string, data: User) {
        setAccessToken(token);
        setUser(data);
        setIsAuthenticated(true)
        sessionStorage.setItem("token", token);
    }

    function logout() {
        setAccessToken("");
        setUser(null);
        setIsAuthenticated(false);
        localStorage.clear()
    }

    return (
        <AuthContext.Provider value={{ logout, isAuthenticated, storeToken, user, accessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};