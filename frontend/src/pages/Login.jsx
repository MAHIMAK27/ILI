import { useState } from 'react';
import { Activity } from 'lucide-react';
import api from '../api/axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card glass-panel">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Activity size={48} color="var(--accent-blue)" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ margin: 0, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ILI Predictor</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Login to access Command Center</p>
      </div>

      {error && (
        <div style={{ padding: '12px', marginBottom: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', border: '1px solid var(--danger)', fontSize: '14px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            className="form-control" 
            placeholder="admin@ilipredictor.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
          {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : 'Sign In'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Demo Credentials: Any email/password will work.
      </div>
    </div>
  );
};

export default Login;
