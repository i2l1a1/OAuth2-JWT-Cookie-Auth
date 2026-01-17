"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "../context/AuthContext";
import {API_BASE} from "../lib/api";

export function ProtectedRoute({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const {username, setUsername} = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${API_BASE}/verify-token`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    router.push("/");
                    return;
                }

                const data = await response.json();
                setUsername(data.username);
            } catch (err) {
                console.error("Error verifying token:", err);
                router.push("/");
            } finally {
                setIsLoading(false);
            }
        };

        void verifyToken();
    }, [router, setUsername]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <p className="text-text-secondary">Loading...</p>
            </div>
        );
    }

    if (!username) {
        return null;
    }

    return <>{children}</>;
}
