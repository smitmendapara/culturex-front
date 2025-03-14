import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Authenticate.css';

const Login = () => (
  <div className='login-container'>
    <h1>CultureX</h1>
    <LoginWithGoogle />
  </div>
);

const LoginWithGoogle = () => {
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      toast.error('Invalid Google response. Please try again.');
      return;
    }

    try {
      const { data } = await axios.post(`${apiBaseUrl}/authentication/google-login`, {
        token: credentialResponse.credential
      });

      if (data.status) {
        localStorage.setItem('authToken', data.data.token);
        navigate('/media');
        toast.success('Login successful!');
      } else {
        toast.error(data.message || 'Login failed.');
      }
    } catch (error) {
      toast.error('Google login failed. Please try again.');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <div className='google-login-wrapper'>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => toast.error('Google Login Failed')}
          useOneTap
          theme='filled_blue'
          shape='pill'
          size='large'
          text='continue_with'
          locale='en'
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
