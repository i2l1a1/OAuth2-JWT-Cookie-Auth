"use client";

import {useAuth} from "../context/AuthContext";
import {ProtectedRoute} from "../components/ProtectedRoute";

function DashboardContent() {
    const {username} = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
            <div className="w-full max-w-2xl">
                <h1 className="text-text-primary text-2xl font-semibold mb-4">
                    Dashboard
                </h1>
                <p className="text-text-secondary">
                    Welcome, {username}! This is another protected page.
                </p>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <DashboardContent/>
        </ProtectedRoute>
    );
}
