import LogoNavBar from './LogoNavBar';
import ItemsNavBar from './ItemsNavBar';
import { Avatar } from '@mui/material';
import { useAvatar } from '../../context/AvatarContext';
import { useUser } from '../../context/UserContext';

const UserNavBar: React.FC = () => {
  const { avatarUrl } = useAvatar();
  const { user } = useUser();
  // console.log('current user : ', user);

  return (
    <nav className="bg-header-background px-6 py-8 shadow-md w-full flex justify-between items-center">
      <LogoNavBar />

      <div className="flex px-4 ml-2">
        <ul className="hidden lg:flex gap-6 text-text justify-end font-light items-center">
          <ItemsNavBar
            items={['Home', 'Posts', 'Community', 'My Profile', 'My Posts', 'Create a Post']}
          />
        </ul>
        <div className="flex items-center justify-end ml-4 gap-3 ">
          <Avatar src={avatarUrl} alt="User Avatar" className="w-10 h-10 " />
          <div className="flex flex-col">
            <span className="text-teal-600 font-semibold">{user?.firstName || 'Hello'}</span>
            <span className="text-gray-600 text-sm">
              {user?.lastName || 'hello'} {user?.firstName || 'hello'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;
