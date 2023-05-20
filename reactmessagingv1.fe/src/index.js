import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './helpers/AuthContext';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom-theme.scss';


const root = createRoot(document.getElementById('root'));
root.render(<React.StrictMode>
    <Router>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Router>
</React.StrictMode>
);

