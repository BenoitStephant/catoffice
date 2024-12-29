import { User } from '../../../types/user';
import { Avatar } from '../avatar';

import './style.css';

interface UserDetailsProps {
    user: User;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
    return (
        <>
            <div className="user-details">
                <Avatar name={`${user.firstName} ${user.lastName}`} className="user-details__avatar" />
                <div className="user-details__meta">
                    <span>
                        {user.firstName} {user.lastName}
                    </span>
                    <span>{user.email}</span>
                </div>
            </div>
        </>
    );
};

export default UserDetails;
