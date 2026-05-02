import { useState } from 'react';
import { Lock, User } from 'lucide-react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication
    if (username === 'admin') {
      onLogin({ username: 'นิติบุคคล', role: 'admin' });
    } else {
      onLogin({ username: 'คุณลูกบ้าน บ้านเลขที่ 123/45', role: 'resident', house_number: '123/45' });
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-box">
        <h1 className="text-center mb-6" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>
          <span style={{ color: 'var(--primary)' }}>ซื่อตรง</span> บางใหญ่ 3
        </h1>
        <p className="text-center text-muted mb-6">ระบบจัดการหมู่บ้านสำหรับนิติบุคคลและลูกบ้าน</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div style={{ position: 'relative' }}>
              <User size={22} color="#3b82f6" style={{ position: 'absolute', top: '13px', left: '16px' }} />
              <input
                type="text"
                placeholder="ชื่อผู้ใช้ หรือ เลขที่บ้าน"
                className="glass-input"
                style={{ paddingLeft: '48px' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div style={{ position: 'relative' }}>
              <Lock size={22} color="#8b5cf6" style={{ position: 'absolute', top: '13px', left: '16px' }} />
              <input
                type="password"
                placeholder="รหัสผ่าน"
                className="glass-input"
                style={{ paddingLeft: '48px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-right mt-2">
              <a href="#" className="text-sm text-primary" style={{ textDecoration: 'none', fontWeight: 600 }}>เปลี่ยนรหัสผ่านด้วยตนเอง</a>
            </div>
          </div>
          
          <button type="submit" className="glass-button">
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
