import { useState } from 'react';
import { Lock, User, Home, CreditCard, MapPin, Phone, MessageCircle, Mail, KeyRound, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Login({ onLogin }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register State
  const [regData, setRegData] = useState({
    house_number: '', full_name: '', id_card_number: '', id_card_address: '',
    phone_number: '', line_id: '', email: '', password: '', pdpa_consented: false
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock Admin Login for Dev
    if (email === 'admin') {
      onLogin({ username: 'นิติบุคคล', role: 'admin' });
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      onLogin({ 
        ...data.user, 
        ...profileData, 
        username: profileData?.full_name || email 
      });
    } catch (err) {
      alert('เข้าสู่ระบบล้มเหลว: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setRegData({ ...regData, [e.target.name]: value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regData.pdpa_consented) {
      alert('กรุณายอมรับนโยบายความเป็นส่วนตัว (PDPA) ก่อนดำเนินการ');
      return;
    }
    
    setLoading(true);
    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: regData.email,
        password: regData.password
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) {
        throw new Error('ไม่สามารถสร้างบัญชีได้ หรือจำเป็นต้องยืนยันอีเมล');
      }

      // 2. Insert into profiles
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: userId,
        role: 'resident',
        house_number: regData.house_number,
        full_name: regData.full_name,
        id_card_number: regData.id_card_number,
        id_card_address: regData.id_card_address,
        phone_number: regData.phone_number,
        line_id: regData.line_id,
        pdpa_consented: regData.pdpa_consented
      }]);

      if (profileError) throw profileError;

      alert('ลงทะเบียนสำเร็จ! ระบบกำลังนำคุณเข้าสู่แดชบอร์ด');
      
      // Auto login after registration
      onLogin({ 
        ...authData.user,
        role: 'resident',
        house_number: regData.house_number,
        full_name: regData.full_name,
        username: regData.full_name
      });
      
    } catch (err) {
      alert('ลงทะเบียนล้มเหลว: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel auth-box" style={{ maxWidth: '500px', width: '100%', padding: '32px' }}>
        <h1 className="text-center mb-6" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>
          <span style={{ color: 'var(--primary)' }}>ซื่อตรง</span> บางใหญ่ 3
        </h1>
        
        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '24px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', padding: '4px' }}>
          <button 
            type="button"
            onClick={() => setIsLoginTab(true)}
            style={{ flex: 1, padding: '10px', border: 'none', background: isLoginTab ? '#fff' : 'transparent', borderRadius: '8px', fontWeight: 600, color: isLoginTab ? 'var(--primary)' : 'var(--text-muted)', boxShadow: isLoginTab ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            เข้าสู่ระบบ
          </button>
          <button 
            type="button"
            onClick={() => setIsLoginTab(false)}
            style={{ flex: 1, padding: '10px', border: 'none', background: !isLoginTab ? '#fff' : 'transparent', borderRadius: '8px', fontWeight: 600, color: !isLoginTab ? 'var(--primary)' : 'var(--text-muted)', boxShadow: !isLoginTab ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            ลงทะเบียน
          </button>
        </div>

        {isLoginTab ? (
          // ================= LOGIN FORM =================
          <form onSubmit={handleLoginSubmit} style={{ animation: 'fadeIn 0.3s' }}>
            <p className="text-center text-muted mb-6">กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งาน</p>
            <div className="mb-4">
              <div style={{ position: 'relative' }}>
                <User size={20} color="#3b82f6" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px' }} />
                <input
                  type="text"
                  placeholder="อีเมล (หรือพิมพ์ admin เพื่อทดสอบ)"
                  className="glass-input"
                  style={{ paddingLeft: '48px', width: '100%' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div style={{ position: 'relative' }}>
                <Lock size={20} color="#8b5cf6" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px' }} />
                <input
                  type="password"
                  placeholder="รหัสผ่าน"
                  className="glass-input"
                  style={{ paddingLeft: '48px', width: '100%' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-right mt-2">
                <a href="#" className="text-sm text-primary" style={{ textDecoration: 'none', fontWeight: 600 }}>ลืมรหัสผ่าน?</a>
              </div>
            </div>
            
            <button type="submit" className="glass-button primary" disabled={loading} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {loading && <Loader2 size={18} className="spin" />}
              เข้าสู่ระบบ
            </button>
          </form>
        ) : (
          // ================= REGISTER FORM =================
          <form onSubmit={handleRegisterSubmit} style={{ animation: 'fadeIn 0.3s', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-center text-muted mb-2">ลงทะเบียนสำหรับลูกบ้านใหม่</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Home size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
                <input type="text" name="house_number" value={regData.house_number} onChange={handleRegChange} className="glass-input" placeholder="บ้านเลขที่ *" style={{ width: '100%', paddingLeft: '38px', fontSize: '0.9rem' }} required />
              </div>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
                <input type="text" name="full_name" value={regData.full_name} onChange={handleRegChange} className="glass-input" placeholder="ชื่อ-นามสกุล *" style={{ width: '100%', paddingLeft: '38px', fontSize: '0.9rem' }} required />
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <CreditCard size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
              <input type="text" name="id_card_number" value={regData.id_card_number} onChange={handleRegChange} className="glass-input" placeholder="เลขบัตรประชาชน 13 หลัก *" maxLength="13" style={{ width: '100%', paddingLeft: '38px', fontSize: '0.9rem' }} required />
            </div>

            <div style={{ position: 'relative' }}>
              <MapPin size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '14px', left: '12px' }} />
              <textarea name="id_card_address" value={regData.id_card_address} onChange={handleRegChange} className="glass-input" placeholder="ที่อยู่ตามบัตรประชาชน *" style={{ width: '100%', paddingLeft: '38px', fontSize: '0.9rem', minHeight: '60px', resize: 'none' }} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
                <input type="tel" name="phone_number" value={regData.phone_number} onChange={handleRegChange} className="glass-input" placeholder="เบอร์โทรศัพท์ *" style={{ width: '100%', paddingLeft: '38px', fontSize: '0.9rem' }} required />
              </div>
              <div style={{ position: 'relative' }}>
                <MessageCircle size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
                <input type="text" name="line_id" value={regData.line_id} onChange={handleRegChange} className="glass-input" placeholder="Line ID" style={{ width: '100%', paddingLeft: '38px', fontSize: '0.9rem' }} />
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
              <input type="email" name="email" value={regData.email} onChange={handleRegChange} className="glass-input" placeholder="อีเมลสำหรับใช้ Login *" style={{ width: '100%', paddingLeft: '38px', fontSize: '0.9rem' }} required />
            </div>

            <div style={{ position: 'relative' }}>
              <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
              <input type="password" name="password" value={regData.password} onChange={handleRegChange} className="glass-input" placeholder="ตั้งรหัสผ่าน (6 ตัวอักษรขึ้นไป) *" style={{ width: '100%', paddingLeft: '38px', fontSize: '0.9rem' }} required />
            </div>

            {/* PDPA Consent Box */}
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="pdpa_consented" 
                  checked={regData.pdpa_consented} 
                  onChange={handleRegChange} 
                  style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: 'var(--primary)', flexShrink: 0 }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: 'var(--primary)', marginBottom: '2px', fontSize: '0.9rem' }}>
                    <ShieldCheck size={16} /> ข้าพเจ้ายินยอมตาม PDPA *
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    ข้าพเจ้ายินยอมให้นิติบุคคลหมู่บ้านซื่อตรง บางใหญ่ 3 เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล รวมถึงเลขบัตรประชาชน เพื่อการยืนยันตัวตนและการออกใบเสร็จ
                  </div>
                </div>
              </label>
            </div>

            <button type="submit" className="glass-button primary" disabled={loading} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              {loading && <Loader2 size={18} className="spin" />}
              ลงทะเบียนเข้าใช้งาน
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
