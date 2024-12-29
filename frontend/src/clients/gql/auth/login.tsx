import { gql } from '@apollo/client';

export const loginMutation = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            id
            email
            roles
            token {
                accessToken
                accessTokenExpiresAt
                accessTokenExpiresIn

                refreshToken
                refreshTokenExpiresAt
                refreshTokenExpiresIn
            }
        }
    }
`;
