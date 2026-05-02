import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Megaphone, Calculator, LogOut, Users } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Announcements from './pages/Announcements';
import Accounting from './pages/Accounting';
import Registration from './pages/Registration';
import Reports from './pages/Reports';
import ReportList from './pages/ReportList';

function MobileHeader({ onLogout }) {
  return (
    <header className="mobile-header" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }}>
          <Home size={18} color="#ffffff" />
        </div>
        <span><span style={{ color: 'var(--primary)' }}>ซื่อตรง</span> บางใหญ่ 3</span>
      </div>
      <button onClick={onLogout} className="glass-button secondary icon-only" style={{ padding: '8px', position: 'absolute', right: '20px' }}>
        <LogOut size={20} color="#ef4444" />
      </button>
    </header>
  );
}

function BottomDock({ role }) {
  const location = useLocation();
  const navItems = [
    { path: '/dashboard', label: 'หน้าหลัก', icon: <Home size={24} color="#3b82f6" /> },
    { path: '/billing', label: 'แจ้งยอด', icon: <FileText size={24} color="#10b981" /> },
    { path: '/announcements', label: 'ประกาศ', icon: <Megaphone size={24} color="#f59e0b" /> },
  ];

  if (role === 'admin') {
    navItems.push({ path: '/accounting', label: 'บัญชี', icon: <Calculator size={24} color="#8b5cf6" /> });
    navItems.push({ path: '/registration', label: 'ลูกบ้าน', icon: <Users size={24} color="#ec4899" /> });
  }

  return (
    <div className="bottom-dock">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`dock-item ${location.pathname === item.path ? 'active' : ''}`}
          data-title={item.label}
        >
          {item.icon}
          <span className="active-dot"></span>
        </Link>
      ))}
    </div>
  );
}

const Layout = ({ children, onLogout, role }) => {
  return (
    <div className="layout-container">
      <MobileHeader onLogout={onLogout} />
      <main className="main-content">
        {children}
      </main>
      <BottomDock role={role} />
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="dynamic-bg"></div>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        
        {user ? (
          <>
            <Route path="/dashboard" element={<Layout onLogout={handleLogout} role={user.role}><Dashboard user={user} /></Layout>} />
            <Route path="/billing" element={<Layout onLogout={handleLogout} role={user.role}><Billing user={user} /></Layout>} />
            <Route path="/announcements" element={<Layout onLogout={handleLogout} role={user.role}><Announcements user={user} /></Layout>} />
            <Route path="/reports" element={<Layout onLogout={handleLogout} role={user.role}><Reports /></Layout>} />
            <Route path="/reports/:type" element={<Layout onLogout={handleLogout} role={user.role}><ReportList /></Layout>} />
            {user.role === 'admin' && (
              <>
                <Route path="/accounting" element={<Layout onLogout={handleLogout} role={user.role}><Accounting user={user} /></Layout>} />
                <Route path="/registration" element={<Layout onLogout={handleLogout} role={user.role}><Registration user={user} /></Layout>} />
              </>
            )}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
