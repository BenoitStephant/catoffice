import { Route, Routes, useNavigate } from 'react-router';

import Login from './pages/login';
import Home from './pages/home';
import Cat from './pages/cat';
import Contact from './pages/contact';

import { Toaster } from './components/ui/toaster';
import { readCookie } from './libs/cookie';
import { useEffect } from 'react';
import { ACCESS_TOKEN_STORAGE_KEY } from './store/auth/storage-key.constant';
import User from './pages/user';

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = readCookie(ACCESS_TOKEN_STORAGE_KEY) !== null;

        if (!isAuthenticated) {
            navigate('/login');
        }

        const currentPath = window.location.pathname;

        if (currentPath === '/login' && isAuthenticated) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<User />} />
                <Route path="/cats" element={<Cat />} />
                <Route path="/contacts" element={<Contact />} />
            </Routes>
            <Toaster />
        </>
    );
};

export default App;
