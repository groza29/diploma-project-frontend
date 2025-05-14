import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAvatar } from '../context/AvatarContext';

const useLogout = () => {
  const { setUser } = useUser();
  const { updateAvatar } = useAvatar();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    updateAvatar();
    navigate('/login');
  };

  return logout;
};
export default useLogout;
