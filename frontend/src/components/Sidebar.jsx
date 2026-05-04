import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Map, LogOut, Activity } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Activity size={28} color="var(--accent-blue)" />
        <span>ILI Predictor</span>
      </div>
      
      <nav className="nav-links" style={{ flex: 1 }}>
        <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/upload" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <UploadCloud size={20} />
          Upload Data
        </NavLink>
        <NavLink to="/map" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Map size={20} />
          Regional Map
        </NavLink>
        <NavLink to="/insights" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Activity size={20} />
          State Insights
        </NavLink>
      </nav>

      <div className="nav-links">
        <button className="nav-link" onClick={onLogout} style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
