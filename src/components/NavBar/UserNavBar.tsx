import LogoNavBar from './LogoNavBar';
import ItemsNavBar from './ItemsNavBar';
import { useAvatar } from '../../context/AvatarContext';
import { useUser } from '../../context/UserContext';
import UserMenu from './UserMenu';

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
        <UserMenu user={user} avatarUrl={avatarUrl} />
      </div>
    </nav>
  );
};

export default UserNavBar;
