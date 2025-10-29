// frontend/src/pages/AuthSuccess.jsx
import { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // login = saves token + user

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Save token
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Get user from backend
    axios.get('http://localhost:5000/api/auth/me')
      .then(res => {
        login(token, res.data);  // ← saves token + user
        navigate('/dashboard');
      })
      .catch(err => {
        console.error('Auth failed:', err);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [searchParams, login, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.2rem' }}>
      <p>🔐 Logging you in...</p>
    </div>
  );
}