import LogoNavBar from './LogoNavBar';
import ItemsNavBar from './ItemsNavBar';
import { Avatar } from '@mui/material';

const UserNavBar: React.FC = () => {
  return (
    <nav className="bg-header-background px-6 py-8 shadow-md w-full flex justify-between items-center">
      <LogoNavBar />

      {/* Middle Section - Navigation */}
      <div className="flex px-4 ml-2">
        <ul className="hidden lg:flex gap-6 text-text justify end font-light items-center">
          <ItemsNavBar
            items={['Home', 'Posts', 'Community', 'My Profile', 'My Posts', 'Create a Post']}
          />
        </ul>
        <div className="flex items-center justify-end ml-4 gap-3">
          <Avatar src="/profile.jpg" alt="User Avatar" className="w-10 h-10 cursor-pointer" />
          <div className="flex flex-col">
            <span className="text-teal-600 font-semibold">USERNAME</span>
            <span className="text-gray-600 text-sm">Full name</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;
