import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/NavBarRoutes';
import Home from './pages/Home';
// import Posts from './pages/Posts';
// import Community from './pages/Community';
// import Profile from './pages/Profile';
// import MyPosts from './pages/MyPosts';
// import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import Register from './pages/Register';
import NavbarRoutes from './components/NavBarRoutes';

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

  // Pages where the navbar should NOT be displayed
  const hideNavbarRoutes = ['/login', '/register'];

  return (
    <div>
      {/* Conditionally render Navbar */}
      {!hideNavbarRoutes.includes(location.pathname) && <NavbarRoutes />}

      {/* Page Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/posts" element={<Posts />} /> */}
        {/* <Route path="/community" element={<Community />} />
        <Route path="/my-profile" element={<Profile />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/create-a-post" element={<CreatePost />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
