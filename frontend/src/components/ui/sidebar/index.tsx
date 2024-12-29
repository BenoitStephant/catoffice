import React from 'react';

import { IconType } from 'react-icons';
import { NavLink } from 'react-router';
import { Text } from '@chakra-ui/react';

import { AiOutlineHome } from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiCatLight, PiAddressBookTabsThin } from 'react-icons/pi';

import UserNav from '../userNav';

import './style.css';

interface NavLinkProps {
    to: string;
    icon: IconType;
    label: string;
}

const navigationLinks: NavLinkProps[] = [
    {
        to: '/',
        icon: AiOutlineHome,
        label: 'Accueil',
    },
    {
        to: '/cats',
        icon: PiCatLight,
        label: 'Chats',
    },
    {
        to: '/contacts',
        icon: PiAddressBookTabsThin,
        label: 'Contacts',
    },
    {
        to: '/users',
        icon: IoSettingsOutline,
        label: 'Utilisateurs',
    },
];

const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar__header">
                <Text as="h2" fontSize="xl" fontWeight="bold">
                    CatOffice
                </Text>
            </div>
            <div className="sidebar__content">
                <nav className="navigation" role="navigation">
                    <ul className="navigation__links">
                        {navigationLinks.map((link) => (
                            <li key={link.to} className="navigation__link">
                                <NavLink to={link.to} className="link">
                                    <span className="link__icon">
                                        <link.icon />
                                    </span>
                                    <span className="link__label">{link.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="sidebar__footer">
                <UserNav
                    user={{
                        id: '1',
                        email: 'test@test.com',
                        firstName: 'John',
                        lastName: 'DOE',
                        roleNames: ['admin'],
                    }}
                />
            </div>
        </aside>
    );
};

export default Sidebar;
