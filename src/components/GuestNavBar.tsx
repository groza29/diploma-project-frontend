import { Link } from 'react-router-dom';
import LogoNavBar from './LogoNavBar';
import ItemsNavBar from './ItemsNavBar';

const GuestNavBar: React.FC = () => {
  return (
    <nav className="bg-header-background px-6 py-8 shadow-md w-full flex justify-between items-center">
      <LogoNavBar />

      {/* Middle Section - Navigation */}
      <ul className="hidden lg:flex gap-6 text-text font-light items-center">
        <ItemsNavBar items={['Home', 'Posts', 'Community']} />
        <Link
          className="px-3 py-1 mt-0 ml-7 bg-button text-text font-light rounded-md hover:bg-selected hover:text-text"
          to={'/login'}
        >
          Sign in
        </Link>
        <Link
          className="px-3 py-1 mt-0 bg-primary text-text font-light rounded-md hover:bg-selected hover:text-text"
          to={'/register'}
        >
          Register
        </Link>
      </ul>
    </nav>
  );
};

export default GuestNavBar;
