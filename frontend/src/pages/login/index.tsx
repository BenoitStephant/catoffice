import React from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';

import './style.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Field } from '../../components/ui/field';
import { Input, Text } from '@chakra-ui/react';
import { Button } from '../../components/ui/button';
import { useMutation } from '@apollo/client';
import { loginMutation } from '../../clients/gql/auth';
import { toaster } from '../../components/ui/toaster';
import { login } from '../../store/auth';
import { User } from '../../types/user';
import { useNavigate } from 'react-router';

const loginFormSchema = z.object({
    email: z.string().email('Veuillez rentrer une adresse email valide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});
type LoginFormSchema = z.infer<typeof loginFormSchema>;

const Login: React.FC = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [startLogin, { loading }] = useMutation(loginMutation, {
        onError: (error) => {
            if (error.message === 'BAD_CREDENTIALS') {
                toaster.error({
                    title: 'Une erreur est survenue',
                    description: 'La combinaison email/mot de passe est incorrecte',
                });
                return;
            }
        },
        onCompleted: (data) => {
            const {
                token: { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt },
                ...rest
            } = data.login;
            const user: User = {
                id: rest.id,
                email: rest.email,
                firstName: rest.firstName,
                lastName: rest.lastName,
                roleNames: rest.roles,
            };

            if (!accessToken || !accessTokenExpiresAt || !refreshToken || !refreshTokenExpiresAt || !user) {
                console.error('Invalid response');
                return;
            }

            dispatch(
                login({
                    accessToken,
                    accessTokenExpiresAt,
                    refreshToken,
                    refreshTokenExpiresAt,
                    user,
                }),
            );
            navigate('/');
        },
    });
    const onSubmit: SubmitHandler<LoginFormSchema> = (data) => {
        startLogin({
            variables: data,
        });
    };

    return (
        <div>
            <div className="login--container">
                <Text as="h1" fontSize="4xl" fontWeight="bold">
                    CatOffice
                </Text>
                <Text as="h3" fontSize="l" fontWeight="bold">
                    Veuillez rentrez votre email et votre mot de passe
                </Text>
                <form onSubmit={handleSubmit(onSubmit)} className="item login--form" noValidate>
                    <Field
                        label="Email"
                        className="login--container__item"
                        required
                        invalid={!!errors.email?.message}
                        errorText={errors.email?.message}
                    >
                        <Input
                            type="email"
                            placeholder="Email"
                            {...register('email')}
                            className="login--form__input"
                            autoComplete="email"
                        />
                    </Field>
                    <Field
                        label="Mot de passe"
                        className="login--container__item"
                        required
                        invalid={!!errors.password?.message}
                        errorText={errors.password?.message}
                    >
                        <Input
                            type="password"
                            placeholder="Mot de passe"
                            {...register('password')}
                            className="login--form__input"
                            autoComplete="password"
                        />
                    </Field>
                    <Button type="submit" className="login--container__item login--form__button" loading={loading}>
                        Se connecter
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
