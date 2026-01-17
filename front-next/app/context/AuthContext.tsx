"use client";

import {createContext, ReactNode, useContext, useState} from "react";

type AuthContextValue = {
    username: string | null;
    setUsername: (value: string | null) => void;
    resetAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [username, setUsername] = useState<string | null>(null);

    const resetAuth = () => setUsername(null);

    return (
        <AuthContext.Provider value={{username, setUsername, resetAuth}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
