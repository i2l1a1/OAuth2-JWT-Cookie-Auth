import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function ProtectedPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [protectedItems, setProtectedItems] = useState(null);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8001/logout', {
                credentials: 'include',
                method: 'POST',
            });

            if (response.ok) {
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const fetchProtectedItems = async () => {
        try {
            const itemsResponse = await fetch(`http://localhost:8001/items`, {
                credentials: 'include',
            });

            if (!itemsResponse.ok) {
                if (itemsResponse.status === 401 || itemsResponse.status === 403) {
                    navigate("/");
                    return;
                }
                throw new Error("Failed to fetch protected items");
            }
            const itemsData = await itemsResponse.json();
            setProtectedItems(itemsData.items);
        } catch (error) {
            console.error("Error fetching protected items:", error);
            navigate("/");
        }
    };

    useEffect(() => {
        const verifyAndFetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8001/verify-token`,
                    {
                        credentials: 'include',
                    }
                );

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        navigate("/");
                        return;
                    }
                    throw new Error("Token verification failed");
                }
                const verifyData = await response.json();
                setUsername(verifyData.username);
                fetchProtectedItems();
            } catch (error) {
                console.error("Error verifying token:", error);
                navigate("/");
            }
        };
        verifyAndFetchData();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
            <div className="w-full max-w-2xl">
                {username ? (
                    <>
                        <div className="mb-6">
                            <p className="text-text-primary text-lg mb-4">
                                Hi, {username}! This is a protected page. Only visible to
                                authenticated users.
                            </p>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-md transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                        {protectedItems ? (
                            <div>
                                <h3 className="text-text-primary text-xl font-semibold mb-4">Protected Items:</h3>
                                <ul className="space-y-2">
                                    {protectedItems.map((item, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-2 bg-bg-secondary border border-border rounded-md text-text-primary"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-text-secondary">Loading protected items...</p>
                        )}
                    </>
                ) : (
                    <p className="text-text-secondary">Loading user data...</p>
                )}
            </div>
        </div>
    );
}

export default ProtectedPage;
