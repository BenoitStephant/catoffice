import React from 'react';

import { IoEllipsisHorizontal } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';

import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../menu';
import UserDetails from '../userDetails';
import { User } from '../../../types/user';
import { logout } from '../../../store/auth';

import './style.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

interface UserNavProps {
    user: User;
}

const UserNav: React.FC<UserNavProps> = ({ user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <MenuRoot positioning={{ placement: 'top' }}>
            <MenuTrigger>
                <div className="user-nav">
                    <UserDetails user={user} />
                    <span className="user-nav-trigger">
                        <IoEllipsisHorizontal />
                    </span>
                </div>
            </MenuTrigger>
            <MenuContent className="user-nav-menu">
                <MenuItem className="user-nav-menu-item" value="logout" onClick={handleLogout}>
                    <IoIosLogOut />
                    <span>Déconnexion</span>
                </MenuItem>
            </MenuContent>
        </MenuRoot>
    );
};

export default UserNav;
