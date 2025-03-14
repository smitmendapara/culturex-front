import { useCallback, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Authenticate';
import Media from './components/MediaUploader';
import { toast } from 'react-toastify';

const App = () => (
  <Router>
    <Main />
  </Router>
);

const Main = () => {
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';

  const validateUserSession = useCallback(async () => {
    const token = localStorage.getItem('authToken');

    if (!token || !(await verifyToken(token))) {
      handleUnauthorized();
    }
  }, []);

  useEffect(() => {
    validateUserSession();
  }, [validateUserSession]);

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/authentication/verify-token`, {
        headers: { Authorization: token },
      });

      return data.code !== 403;
    } catch (error) {
      toast.error('Token verification failed.');
      return false;
    }
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/media' element={<Media />} />
    </Routes>
  );
};

export default App;