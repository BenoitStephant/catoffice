import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { toaster } from '../../components/ui/toaster';

const GQL_SERVER_URL = import.meta.env.VITE_GQL_SERVER_URL;

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    console.log('graphQLErrors', graphQLErrors);
    console.log('operation', operation);
    if (networkError) {
        toaster.error({
            title: 'Une erreur est survenue lors de la communication avec le serveur',
        });
    }
    if (graphQLErrors) {
        graphQLErrors.forEach((error) => {
            if (error.message === 'UNKNOW_ERROR') {
                toaster.error({
                    title: 'Une erreur inconnue est survenue',
                });
            }
        });
    }
});

const link = new HttpLink({ uri: GQL_SERVER_URL });

export const catofficeApiClient = new ApolloClient({
    uri: GQL_SERVER_URL,
    cache: new InMemoryCache(),
});

catofficeApiClient.setLink(from([errorLink, link]));
