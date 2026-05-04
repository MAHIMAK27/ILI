import { useState } from 'react';
import { Activity } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="auth-card glass-panel">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Activity size={48} color="var(--accent-blue)" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ margin: 0, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ILI Predictor</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Login to access Command Center</p>
      </div>

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
