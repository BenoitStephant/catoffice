import React from 'react';

import { createRoot } from 'react-dom/client';
import { system } from '@chakra-ui/react/preset';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';

import App from './app';
import { catofficeApiClient } from './clients/gql';

import './styles/app.css';

createRoot(document.getElementById('__app')!).render(
    <React.StrictMode>
        <ChakraProvider value={system}>
            <ApolloProvider client={catofficeApiClient}>
                <App />
            </ApolloProvider>
        </ChakraProvider>
    </React.StrictMode>,
);
