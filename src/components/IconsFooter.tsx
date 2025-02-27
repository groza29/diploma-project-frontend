import { Link } from 'react-router-dom';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const IconsFooter: React.FC = () => (
  <>
    <div>
      <div>
        <Link to="/" className="text-xl w-10 h-10 font-semibold flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        </Link>
      </div>

      <div className="mt-4 flex gap-4">
        <Link to="/">
          <XIcon className="text-selected text-opacity-45" />
        </Link>
        <Link to="/">
          <InstagramIcon className="text-selected text-opacity-45" />
        </Link>
        <Link to="/">
          <YouTubeIcon className="text-selected text-opacity-45" />
        </Link>
        <Link to="/">
          <LinkedInIcon className="text-selected text-opacity-45" />
        </Link>
      </div>
    </div>
  </>
);

export default IconsFooter;
