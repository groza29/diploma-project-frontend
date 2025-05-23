import { jwtDecode } from 'jwt-decode';
import JwtDecodeUserType from '../models/JwtDecodeUserType';
import GuestHome from '../components/Home/GuestHome';
import UserHome from '../components/Home/UserHome';
import AdminHome from '../components/Home/AdminHome';

const Home: React.FC = () => {
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode<JwtDecodeUserType>(token) : null;
  if (!token) {
    return <GuestHome />;
  }
  return user?.role === 'admin' ? <AdminHome /> : <UserHome />;
};
export default Home;
