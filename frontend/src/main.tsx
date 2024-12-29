import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { system } from '@chakra-ui/react/preset';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import store from './store';

import App from './app';
import { catofficeApiClient } from './clients/gql';

import './styles/app.css';

createRoot(document.getElementById('__app')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ChakraProvider value={system}>
                <ApolloProvider client={catofficeApiClient}>
                    <App />
                </ApolloProvider>
            </ChakraProvider>
        </Provider>
    </React.StrictMode>,
);
