import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NavbarRoutes from './components/NavBar/NavBarRoutes';
import MyProfile from './pages/MyProfile';
import { AvatarProvider } from './context/AvatarContext';
import { UserProvider } from './context/UserContext';
import CreatePost from './pages/CreatePost';
import MyPosts from './pages/MyPosts';
import EditPost from './pages/EditPost';
import Community from './pages/Comunity';
import Post from './pages/Posts';
import MyApplications from './pages/MyApplications';
import Home from './pages/Home';
import AdminApplications from './pages/Applications';
import AdminJobsPage from './pages/Jobs';
import ForgotPassword from './pages/ForgotPassword';

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

// Separate component for layout logic
const MainLayout = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/register'];

  const shouldHideNavbar =
    hideNavbarRoutes.includes(location.pathname) ||
    /^\/forgot-password\/[^/]+$/.test(location.pathname);

  return (
    <div>
      <AvatarProvider>
        <UserProvider>
          {/* Conditionally render Navbar */}
          {!shouldHideNavbar && <NavbarRoutes />}

          {/* Page Content */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/posts" element={<Post />} />
            <Route path="/community" element={<Community />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/create-a-post" element={<CreatePost />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/profile/:id" element={<MyProfile />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/applications" element={<AdminApplications />} />
            <Route path="/jobs" element={<AdminJobsPage />} />
            <Route path="/forgot-password/:id" element={<ForgotPassword />} />
          </Routes>
        </UserProvider>
      </AvatarProvider>
    </div>
  );
};

export default App;
