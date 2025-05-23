import LogoNavBar from './LogoNavBar';
import ItemsNavBar from './ItemsNavBar';
import { Logout } from '@mui/icons-material';
import Button from '../Button';
import useLogout from '../../hooks/Logout';

const AdminNavBar: React.FC = () => {
  const logout = useLogout();

  return (
    <nav className="bg-header-background px-6 py-8 shadow-md w-full flex justify-between items-center">
      <LogoNavBar />

      <div className="flex px-4 ml-2">
        <ul className="hidden lg:flex gap-6 text-text justify-end font-light items-center">
          <ItemsNavBar items={['Home', 'Posts', 'Community', 'Applications', 'Jobs']} />
        </ul>
      </div>
      <Button
        onClick={() => {
          logout();
        }}
        text="Log out"
        icon={<Logout />}
      />
    </nav>
  );
};

export default AdminNavBar;
