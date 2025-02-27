import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const LogoNavBar: React.FC = () => {
  return (
    <>
      <div className="flex items-center gap-4">
        <MenuIcon className="text-2xl cursor-pointer lg:!hidden" />
        <Link to="/" className="text-xl font-semibold flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        </Link>
      </div>
    </>
  );
};

export default LogoNavBar;
