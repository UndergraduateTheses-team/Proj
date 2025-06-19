import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '~/App';
import { Provider } from 'react-redux';
import store from './components/store';
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from './context/authContext';
import { Toaster } from 'react-hot-toast';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <Provider store={store}>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </Provider>
        <Toaster />
    </BrowserRouter>,
    // </React.StrictMode>,
);
