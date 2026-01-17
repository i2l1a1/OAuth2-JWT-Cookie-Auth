"use client";

import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "./context/AuthContext";
import {API_BASE} from "./lib/api";

export default function AuthPage() {
    const router = useRouter();
    const {setUsername: setAuthUsername, resetAuth} = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const validateForm = () => {
        if (!username || !password) {
            setError("Username and password are required");
            return false;
        }
        setError("");
        return true;
    };

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE}/register`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            setLoading(false);

            if (response.ok) {
                setIsRegister(false);
                setUsername("");
                setPassword("");
                resetAuth();
            } else {
                const errorData = await response.json();
                if (response.status === 400 && errorData.detail === "Username already registered") {
                    setError("Username already registered");
                } else {
                    setError(errorData.detail || "Registration failed!");
                }
            }
        } catch (err) {
            setLoading(false);
            setError("An error occurred. Please try again later.");
        }
    };

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError("");

        const formDetails = new URLSearchParams();
        formDetails.append("username", username);
        formDetails.append("password", password);

        try {
            const response = await fetch(`${API_BASE}/token`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formDetails,
            });

            setLoading(false);

            if (response.ok) {
                setAuthUsername(username);
                router.push("/protected");
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Authentication failed!");
            }
        } catch (err) {
            setLoading(false);
            setError("An error occurred. Please try again later.");
        }
    };

    const toggleMode = () => {
        setIsRegister((prev) => !prev);
        setError("");
        setUsername("");
        setPassword("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
            <div className="w-full max-w-md">
                <div className="bg-bg-card rounded-lg shadow-lg p-8 border border-border">
                    <div className="mb-6 flex justify-center">
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors border-b-2 border-transparent hover:border-accent"
                        >
                            {isRegister ? "Switch to Login" : "Switch to Register"}
                        </button>
                    </div>
                    <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-md text-text-primary placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                placeholder="Enter username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-md text-text-primary placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                placeholder="Enter password"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-accent hover:bg-accent-hover text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? isRegister
                                    ? "Registering..."
                                    : "Logging in..."
                                : isRegister
                                    ? "Register"
                                    : "Login"}
                        </button>
                        {error && <p className="text-sm text-error text-center">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
