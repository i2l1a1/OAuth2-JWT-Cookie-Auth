"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "../context/AuthContext";
import {ProtectedRoute} from "../components/ProtectedRoute";
import {API_BASE} from "../lib/api";

function ProtectedPageContent() {
    const router = useRouter();
    const {username, resetAuth} = useAuth();
    const [protectedItems, setProtectedItems] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE}/logout`, {
                credentials: "include",
                method: "POST",
            });

            if (response.ok) {
                resetAuth();
                router.push("/");
            } else {
                // Logging only; UI mirrors original behavior
                console.error("Logout failed");
            }
        } catch (err) {
            console.error("Error during logout:", err);
        }
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${API_BASE}/items`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        router.push("/");
                        return;
                    }
                    throw new Error("Failed to fetch protected items");
                }
                const data = await response.json();
                setProtectedItems(data.items);
            } catch (err) {
                console.error("Error fetching protected items:", err);
                router.push("/");
            } finally {
                setIsLoading(false);
            }
        };

        void fetchItems();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
            <div className="w-full max-w-2xl">
                <div className="mb-6">
                    <p className="text-text-primary text-lg mb-4">
                        Hi, {username}! This is a protected page. Only visible to authenticated users.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-md transition-colors"
                    >
                        Logout
                    </button>
                </div>
                {isLoading ? (
                    <p className="text-text-secondary">Loading protected items...</p>
                ) : protectedItems && protectedItems.length > 0 ? (
                    <div>
                        <h3 className="text-text-primary text-xl font-semibold mb-4">Protected Items:</h3>
                        <ul className="space-y-2">
                            {protectedItems.map((item, index) => (
                                <li
                                    key={`${item}-${index}`}
                                    className="px-4 py-2 bg-bg-secondary border border-border rounded-md text-text-primary"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-text-secondary">No items available.</p>
                )}
            </div>
        </div>
    );
}

export default function ProtectedPage() {
    return (
        <ProtectedRoute>
            <ProtectedPageContent/>
        </ProtectedRoute>
    );
}
