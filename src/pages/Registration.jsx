import { useState, useEffect } from 'react';
import { UserPlus, Search, Edit2, Trash2, Home, Phone, Mail, KeyRound, X, Check, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { createClient } from '@supabase/supabase-js';

// Separate client for Auth to prevent Admin session from being overwritten
const supabaseAuthClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export default function Registration() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    house_number: '',
    full_name: '',
    phone_number: '',
    email: '',
    password: ''
  });

  // โหลดข้อมูลลูกบ้านจาก Supabase ตอนเปิดหน้า
  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'resident')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setResidents(data || []);
    } catch (error) {
      console.error('Error fetching residents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePassword = () => {
    const randomPass = Math.random().toString(36).slice(-8);
    setFormData({ ...formData, password: randomPass });
  };

  const handleAddResident = async (e) => {
    e.preventDefault();
    if (!formData.house_number || !formData.full_name || !formData.email || !formData.password) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. สร้างบัญชีผู้ใช้ในระบบ Auth
      const { data: authData, error: authError } = await supabaseAuthClient.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) {
         throw new Error('ระบบยังไม่ได้คืนค่า ID ผู้ใช้ (อาจต้องตั้งค่าปิด Confirm Email ใน Supabase ก่อน)');
      }

      // 2. บันทึกข้อมูลรายละเอียดลงในตาราง profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            role: 'resident',
            house_number: formData.house_number,
            full_name: formData.full_name,
            phone_number: formData.phone_number
          }
        ]);

      if (profileError) throw profileError;

      alert('ลงทะเบียนลูกบ้านสำเร็จ!\n\nกรุณาส่ง "อีเมล" และ "รหัสผ่านชั่วคราว" นี้ให้ลูกบ้านเพื่อเข้าใช้งานครับ');
      setShowAddForm(false);
      setFormData({ house_number: '', full_name: '', phone_number: '', email: '', password: '' });
      fetchResidents(); // ดึงข้อมูลอัปเดตใหม่มาแสดง

    } catch (error) {
      console.error('Registration Error:', error);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredResidents = residents.filter(r => 
    (r.house_number && r.house_number.includes(searchTerm)) || 
    (r.full_name && r.full_name.includes(searchTerm))
  );

  return (
    <div style={{ paddingBottom: '80px' }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title" style={{ margin: 0 }}>จัดการทะเบียนลูกบ้าน</h1>
        <button 
          className="glass-button primary" 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          disabled={isSubmitting}
        >
          {showAddForm ? <X size={20} /> : <UserPlus size={20} />}
          {showAddForm ? 'ยกเลิก' : 'เพิ่มลูกบ้าน'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', animation: 'fadeIn 0.3s ease-out' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem', color: 'var(--primary)' }}>แบบฟอร์มลงทะเบียนลูกบ้านใหม่</h2>
          <form onSubmit={handleAddResident} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>บ้านเลขที่ *</label>
                <div style={{ position: 'relative' }}>
                  <Home size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" name="house_number" value={formData.house_number} onChange={handleInputChange} className="glass-input" placeholder="เช่น 78/123" style={{ width: '100%', paddingLeft: '40px' }} required />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>ชื่อ-นามสกุล (เจ้าบ้าน/ผู้พักอาศัย) *</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} className="glass-input" placeholder="ชื่อ นามสกุล" style={{ width: '100%' }} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>เบอร์โทรศัพท์</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="glass-input" placeholder="08X-XXX-XXXX" style={{ width: '100%', paddingLeft: '40px' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>อีเมล (สำหรับใช้ Login) *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="glass-input" placeholder="example@email.com" style={{ width: '100%', paddingLeft: '40px' }} required />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>รหัสผ่านชั่วคราว (ให้ลูกบ้านไปเปลี่ยนทีหลัง) *</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" name="password" value={formData.password} onChange={handleInputChange} className="glass-input" placeholder="กำหนดรหัสผ่าน 6 ตัวขึ้นไป" style={{ width: '100%', paddingLeft: '40px' }} required />
                </div>
                <button type="button" onClick={generatePassword} className="glass-button secondary" style={{ whiteSpace: 'nowrap' }}>
                  สุ่มรหัสผ่าน
                </button>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="glass-button secondary">ยกเลิก</button>
              <button type="submit" className="glass-button primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 size={20} className="spin" /> : <Check size={20} />} 
                {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันการลงทะเบียน'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ช่องค้นหา */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          className="glass-input" 
          placeholder="ค้นหาด้วยบ้านเลขที่ หรือ ชื่อลูกบ้าน..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', paddingLeft: '48px', paddingRight: '16px' }}
        />
      </div>

      {/* รายชื่อลูกบ้าน */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>กำลังโหลดข้อมูลลูกบ้าน...</div>
        ) : filteredResidents.length > 0 ? (
          filteredResidents.map((resident) => (
            <div key={resident.id} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '16px', borderRadius: '16px', textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>บ้านเลขที่</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{resident.house_number || '-'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{resident.full_name || 'ไม่ระบุชื่อ'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <Phone size={12} /> {resident.phone_number || '-'}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="glass-button secondary icon-only" style={{ padding: '8px' }} title="แก้ไข">
                    <Edit2 size={16} color="var(--primary)" />
                  </button>
                  <button className="glass-button secondary icon-only" style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)' }} title="ลบข้อมูล">
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            ยังไม่มีข้อมูลลูกบ้านในระบบ
          </div>
        )}
      </div>
    </div>
  );
}
