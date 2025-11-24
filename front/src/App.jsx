import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import ProtectedPage from "./Protected.jsx";

function App() {
    return (
        <Router
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/protected" element={<ProtectedPage />} />
            </Routes>
        </Router>
    );
}

export default App;
