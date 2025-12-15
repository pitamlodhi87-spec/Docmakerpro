
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userName', data.name);
        if (data.role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/shop');
        }
        window.location.reload(); // Refresh to update header state
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to connect to server. Ensure backend is running on port 3000.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-chrome-blue/10 text-chrome-blue rounded-xl flex items-center justify-center mx-auto mb-4">
           <LogIn size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500">Sign in to access pro tools and purchases</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-chrome-blue"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-chrome-blue"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="w-full bg-chrome-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
          Log In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account? <Link to="/signup" className="text-chrome-blue font-bold hover:underline">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
