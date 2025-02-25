import { FiMenu } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const LogoNavBar: React.FC = () => {
  return (
    <>
      <div className="flex items-center gap-4">
        <FiMenu className="text-2xl cursor-pointer lg:hidden" />
        <Link to="/" className="text-xl font-semibold flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        </Link>
      </div>
    </>
  );
};

export default LogoNavBar;
