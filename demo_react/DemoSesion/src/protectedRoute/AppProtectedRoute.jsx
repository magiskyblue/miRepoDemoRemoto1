import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './Login';

export default function AppProtectedRoute(){
    return (
        <BrowserRouter>
        <Routes>
        <route
            path="/login"
            element={<Login onLogin={checkAuth}/>}
            />
        <route/>
        <route/>
        </Routes>
        </BrowserRouter>
    );
}