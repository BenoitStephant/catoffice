import { BrowserRouter, Route, Routes } from 'react-router';

import Login from './pages/login';
import Home from './pages/home';

import { Toaster } from './components/ui/toaster';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route index element={<Home />} />
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
};

export default App;
